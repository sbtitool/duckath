import "dotenv/config";
import { config } from "dotenv";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "../src/db";

config({ path: ".env" });
config({ path: ".env.development" });
config({ path: ".env.local" });

type StatusName = "serializing" | "completed" | "paused" | "hidden";
type ChargeName = "free" | "chapter" | "book" | "mixed";

type ImportChapter = {
  chapter_no?: number;
  title: string;
  slug?: string;
  content: string;
  content_text?: string;
  is_free?: boolean;
  price_credits?: number | null;
  status?: number;
  source_chapter_id?: string;
  published_at?: string;
};

type ImportBook = {
  uuid?: string;
  title: string;
  slug?: string;
  original_title?: string;
  author_name?: string;
  cover_url?: string;
  summary?: string;
  author_note?: string;
  copyright_notice?: string;
  seo_title?: string;
  seo_description?: string;
  source_url?: string;
  source_book_id?: string;
  book_status?: number | StatusName;
  charge_type?: number | ChargeName;
  default_chapter_price?: number;
  full_book_price?: number;
  allow_chapter_purchase?: boolean;
  allow_full_purchase?: boolean;
  copyright_status?: number;
  is_recommended?: boolean;
  recommend_sort?: number;
  published_at?: string;
  genres?: string[];
  tags?: string[];
  chapters?: ImportChapter[];
};

type ImportPayload = {
  genres?: Array<{ name: string; slug?: string; sort_order?: number }>;
  books: ImportBook[];
};

type DbTransaction = any;

function rowsOf<T>(result: unknown): T[] {
  if (Array.isArray(result)) {
    return result as T[];
  }

  const maybeRows = (result as { rows?: unknown[] } | null)?.rows;
  return Array.isArray(maybeRows) ? (maybeRows as T[]) : [];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function statusCode(value: ImportBook["book_status"]): number {
  if (typeof value === "number") {
    return value;
  }

  const map: Record<StatusName, number> = {
    serializing: 1,
    completed: 2,
    paused: 3,
    hidden: 4,
  };

  return value ? map[value] : 1;
}

function chargeCode(value: ImportBook["charge_type"]): number {
  if (typeof value === "number") {
    return value;
  }

  const map: Record<ChargeName, number> = {
    free: 1,
    chapter: 2,
    book: 3,
    mixed: 4,
  };

  return value ? map[value] : 1;
}

function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value: string): number {
  const text = stripHtml(value);
  if (!text) {
    return 0;
  }

  const englishWords = text.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)?/g) || [];
  const cjkChars = text.match(/[\u4e00-\u9fff]/g) || [];

  return englishWords.length + cjkChars.length;
}

function parseDate(value?: string): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return date.toISOString();
}

function fitVarchar(value: string | null | undefined, maxLength: number): string | null {
  if (!value) {
    return null;
  }

  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function upsertGenre(
  tx: DbTransaction,
  nameOrSlug: string,
  sortOrder = 0
): Promise<number> {
  const slug = slugify(nameOrSlug);
  const name = nameOrSlug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const genre = rowsOf<{ id: number }>(
    await tx.execute(sql`
      insert into genres (name, slug, sort_order)
      values (${name}, ${slug}, ${sortOrder})
      on conflict (slug) do update set
        name = excluded.name
      returning id
    `)
  )[0];

  return genre.id;
}

async function upsertTag(
  tx: DbTransaction,
  nameOrSlug: string,
  sortOrder = 0
): Promise<number> {
  const slug = slugify(nameOrSlug);
  const name = nameOrSlug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const tag = rowsOf<{ id: number }>(
    await tx.execute(sql`
      insert into tags (name, slug, sort_order)
      values (${name}, ${slug}, ${sortOrder})
      on conflict (slug) do update set
        name = excluded.name
      returning id
    `)
  )[0];

  return tag.id;
}

async function importBook(
  tx: DbTransaction,
  book: ImportBook
) {
  if (!book.title) {
    throw new Error("Book title is required");
  }

  const bookSlug = fitVarchar(book.slug || slugify(book.title), 255);
  if (!bookSlug) {
    throw new Error(`Book slug is empty for title: ${book.title}`);
  }

  const chapters = book.chapters || [];
  const bookTitle = fitVarchar(book.title, 255);
  const now = new Date().toISOString();
  const bookStatus = statusCode(book.book_status);
  const chargeType = chargeCode(book.charge_type);
  const allowFullPurchase =
    book.allow_full_purchase ?? (bookStatus === 2 && [3, 4].includes(chargeType));
  const wordTotal = chapters.reduce((total, chapter) => {
    return total + wordCount(chapter.content_text || chapter.content);
  }, 0);
  const latestChapter = [...chapters]
    .filter((chapter) => chapter.status !== 0)
    .sort((a, b) => (b.chapter_no || 0) - (a.chapter_no || 0))[0];

  const insertedBook = rowsOf<{ id: number }>(
    await tx.execute(sql`
      insert into books (
        uuid,
        slug,
        title,
        original_title,
        author_name,
        cover_url,
        book_status,
        charge_type,
        default_chapter_price,
        full_book_price,
        allow_chapter_purchase,
        allow_full_purchase,
        chapter_count,
        word_count,
        latest_chapter_title,
        latest_chapter_at,
        is_recommended,
        recommend_sort,
        copyright_status,
        published_at,
        created_at,
        updated_at
      )
      values (
        ${fitVarchar(book.uuid || randomUUID(), 255)},
        ${bookSlug},
        ${bookTitle},
        ${fitVarchar(book.original_title, 255)},
        ${fitVarchar(book.author_name, 255)},
        ${fitVarchar(book.cover_url, 500)},
        ${bookStatus},
        ${chargeType},
        ${book.default_chapter_price || 0},
        ${book.full_book_price || 0},
        ${book.allow_chapter_purchase ?? true},
        ${allowFullPurchase},
        ${chapters.length},
        ${wordTotal},
        ${fitVarchar(latestChapter?.title, 255)},
        ${parseDate(latestChapter?.published_at)},
        ${book.is_recommended || false},
        ${book.recommend_sort || 0},
        ${book.copyright_status || 1},
        ${parseDate(book.published_at)},
        ${now},
        ${now}
      )
      on conflict (slug) do update set
        title = excluded.title,
        original_title = excluded.original_title,
        author_name = excluded.author_name,
        cover_url = excluded.cover_url,
        book_status = excluded.book_status,
        charge_type = excluded.charge_type,
        default_chapter_price = excluded.default_chapter_price,
        full_book_price = excluded.full_book_price,
        allow_chapter_purchase = excluded.allow_chapter_purchase,
        allow_full_purchase = excluded.allow_full_purchase,
        chapter_count = excluded.chapter_count,
        word_count = excluded.word_count,
        latest_chapter_title = excluded.latest_chapter_title,
        latest_chapter_at = excluded.latest_chapter_at,
        is_recommended = excluded.is_recommended,
        recommend_sort = excluded.recommend_sort,
        copyright_status = excluded.copyright_status,
        published_at = excluded.published_at,
        updated_at = excluded.updated_at
      returning id
    `)
  )[0];

  const bookId = insertedBook.id;

  await tx.execute(sql`
    insert into book_details (
      book_id,
      summary,
      author_note,
      copyright_notice,
      seo_title,
      seo_description,
      source_url,
      source_book_id,
      updated_at
    )
    values (
      ${bookId},
      ${book.summary || null},
      ${book.author_note || null},
      ${book.copyright_notice || null},
      ${fitVarchar(book.seo_title || book.title, 255)},
      ${fitVarchar(book.seo_description || book.summary, 500)},
      ${fitVarchar(book.source_url, 500)},
      ${fitVarchar(book.source_book_id, 255)},
      ${now}
    )
    on conflict (book_id) do update set
      summary = excluded.summary,
      author_note = excluded.author_note,
      copyright_notice = excluded.copyright_notice,
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
      source_url = excluded.source_url,
      source_book_id = excluded.source_book_id,
      updated_at = excluded.updated_at
  `);

  for (let i = 0; i < (book.genres || []).length; i += 1) {
    const genreId = await upsertGenre(tx, book.genres![i], i + 1);
    await tx.execute(sql`
      insert into book_genres (book_id, genre_id)
      values (${bookId}, ${genreId})
      on conflict (book_id, genre_id) do nothing
    `);
  }

  if (book.tags) {
    await tx.execute(sql`
      delete from book_tags
      where book_id = ${bookId}
    `);

    for (let i = 0; i < book.tags.length; i += 1) {
      const tagId = await upsertTag(tx, book.tags[i], i + 1);
      await tx.execute(sql`
        insert into book_tags (book_id, tag_id)
        values (${bookId}, ${tagId})
        on conflict (book_id, tag_id) do nothing
      `);
    }
  }

  const preparedChapters = chapters.map((chapter, index) => {
    const chapterNo = chapter.chapter_no || index + 1;
    const contentText = chapter.content_text || stripHtml(chapter.content);
    const publishedAt = parseDate(chapter.published_at);

    return {
      chapterNo,
      title: fitVarchar(chapter.title, 255),
      slug: fitVarchar(chapter.slug || `chapter-${chapterNo}`, 255),
      isFree: chapter.is_free ?? false,
      priceCredits: chapter.price_credits ?? null,
      status: chapter.status ?? 1,
      wordCount: wordCount(contentText),
      sourceChapterId: fitVarchar(chapter.source_chapter_id, 255),
      publishedAt,
      publishedDate: publishedAt ? new Date(publishedAt) : null,
      content: chapter.content,
      contentText,
    };
  });

  let latestChapterNo: number | null = null;
  let latestPublishedAt: Date | null = null;

  for (const chapter of preparedChapters) {
    if (
      chapter.status !== 0 &&
      (!latestPublishedAt ||
        (chapter.publishedDate &&
          chapter.publishedDate.getTime() >= latestPublishedAt.getTime()) ||
        (!chapter.publishedAt && chapter.chapterNo >= (latestChapter?.chapter_no || 0)))
    ) {
      latestChapterNo = chapter.chapterNo;
      latestPublishedAt = chapter.publishedDate || latestPublishedAt;
    }
  }

  let latestChapterId: number | null = null;

  if (preparedChapters.length > 0) {
    const chapterValues = preparedChapters.map((chapter) => sql`
      (
        ${bookId},
        ${chapter.chapterNo},
        ${chapter.title},
        ${chapter.slug},
        ${chapter.isFree},
        ${chapter.priceCredits},
        ${chapter.status},
        ${chapter.wordCount},
        ${chapter.sourceChapterId},
        ${chapter.publishedAt},
        ${now},
        ${now}
      )
    `);

    const insertedChapters = rowsOf<{ id: number; chapter_no: number }>(
      await tx.execute(sql`
        insert into chapters (
          book_id,
          chapter_no,
          title,
          slug,
          is_free,
          price_credits,
          status,
          word_count,
          source_chapter_id,
          published_at,
          created_at,
          updated_at
        )
        values ${sql.join(chapterValues, sql`, `)}
        on conflict (book_id, chapter_no) do update set
          title = excluded.title,
          slug = excluded.slug,
          is_free = excluded.is_free,
          price_credits = excluded.price_credits,
          status = excluded.status,
          word_count = excluded.word_count,
          source_chapter_id = excluded.source_chapter_id,
          published_at = excluded.published_at,
          updated_at = excluded.updated_at
        returning id, chapter_no
      `)
    );

    const chapterIdsByNo = new Map(
      insertedChapters.map((chapter) => [chapter.chapter_no, chapter.id])
    );

    for (const batch of chunkArray(preparedChapters, 100)) {
      const contentValues = batch.map((chapter) => {
        const chapterId = chapterIdsByNo.get(chapter.chapterNo);
        if (!chapterId) {
          throw new Error(`Chapter id not found for chapter ${chapter.chapterNo}`);
        }

        return sql`
          (
            ${chapterId},
            ${bookId},
            ${chapter.content},
            ${chapter.contentText},
            ${now}
          )
        `;
      });

      await tx.execute(sql`
        insert into chapter_contents (
          chapter_id,
          book_id,
          content,
          content_text,
          updated_at
        )
        values ${sql.join(contentValues, sql`, `)}
        on conflict (chapter_id) do update set
          content = excluded.content,
          content_text = excluded.content_text,
          updated_at = excluded.updated_at
      `);
    }

    latestChapterId = latestChapterNo
      ? chapterIdsByNo.get(latestChapterNo) || null
      : null;
  }

  if (latestChapterId) {
    await tx.execute(sql`
      update books
      set latest_chapter_id = ${latestChapterId}
      where id = ${bookId}
    `);
  }

  return { id: bookId, title: book.title, chapters: chapters.length };
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    throw new Error("Usage: pnpm db:import:novels data/novels/example.json");
  }

  const raw = await readFile(filePath, "utf8");
  const payload = JSON.parse(raw) as ImportPayload;

  if (!payload.books || !Array.isArray(payload.books)) {
    throw new Error("Import file must contain a books array");
  }

  const result = await db().transaction(async (tx) => {
    for (let i = 0; i < (payload.genres || []).length; i += 1) {
      const genre = payload.genres![i];
      await upsertGenre(tx, genre.slug || genre.name, genre.sort_order || i + 1);
    }

    const imported = [];
    for (const book of payload.books) {
      imported.push(await importBook(tx, book));
    }

    return imported;
  });

  console.log(`Imported ${result.length} books.`);
  for (const book of result) {
    console.log(`- ${book.title}: ${book.chapters} chapters`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("Import novels failed:", error);
  process.exit(1);
});
