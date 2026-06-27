import { sql } from "drizzle-orm";
import { db } from "./index";

type PurchaseBookInput = {
  userUuid: string;
  bookId: number;
  transNo: string;
  now?: Date;
};

type PurchaseChapterInput = {
  userUuid: string;
  chapterId: number;
  transNo: string;
  now?: Date;
};

type PurchaseResult = {
  alreadyPurchased: boolean;
  priceCredits: number;
  balanceAfter: number | null;
};

type AccessResult = {
  canRead: boolean;
  reason:
    | "free"
    | "book_free"
    | "full_book_purchased"
    | "chapter_purchased"
    | "requires_purchase";
  priceCredits: number;
};

function rowsOf<T>(result: unknown): T[] {
  if (Array.isArray(result)) {
    return result as T[];
  }

  const maybeRows = (result as { rows?: unknown[] } | null)?.rows;
  return Array.isArray(maybeRows) ? (maybeRows as T[]) : [];
}

export async function purchaseBook({
  userUuid,
  bookId,
  transNo,
  now = new Date(),
}: PurchaseBookInput): Promise<PurchaseResult> {
  return db().transaction(async (tx) => {
    const existing = rowsOf<{ id: number }>(
      await tx.execute(sql`
        select id
        from user_book_purchases
        where user_uuid = ${userUuid} and book_id = ${bookId}
        limit 1
      `)
    )[0];

    if (existing) {
      return {
        alreadyPurchased: true,
        priceCredits: 0,
        balanceAfter: null,
      };
    }

    const book = rowsOf<{
      book_status: number;
      full_book_price: number;
      allow_full_purchase: boolean;
      charge_type: number;
    }>(
      await tx.execute(sql`
        select book_status, full_book_price, allow_full_purchase, charge_type
        from books
        where id = ${bookId}
        limit 1
      `)
    )[0];

    if (!book) {
      throw new Error("Book not found");
    }

    if (
      book.book_status !== 2 ||
      !book.allow_full_purchase ||
      book.full_book_price <= 0 ||
      ![3, 4].includes(book.charge_type)
    ) {
      throw new Error("This book cannot be purchased as a full book");
    }

    const credit = rowsOf<{ balance: number }>(
      await tx.execute(sql`
        select balance
        from user_credits
        where user_uuid = ${userUuid}
        for update
      `)
    )[0];

    if (!credit) {
      throw new Error("User credit account not found");
    }

    const existingAfterLock = rowsOf<{ id: number }>(
      await tx.execute(sql`
        select id
        from user_book_purchases
        where user_uuid = ${userUuid} and book_id = ${bookId}
        limit 1
      `)
    )[0];

    if (existingAfterLock) {
      return {
        alreadyPurchased: true,
        priceCredits: 0,
        balanceAfter: credit.balance,
      };
    }

    if (credit.balance < book.full_book_price) {
      throw new Error("Insufficient credits");
    }

    const updatedCredit = rowsOf<{ balance: number }>(
      await tx.execute(sql`
        update user_credits
        set
          balance = balance - ${book.full_book_price},
          total_spent = total_spent + ${book.full_book_price},
          updated_at = ${now}
        where user_uuid = ${userUuid} and balance >= ${book.full_book_price}
        returning balance
      `)
    )[0];

    if (!updatedCredit) {
      throw new Error("Insufficient credits");
    }

    await tx.execute(sql`
      insert into user_book_purchases (
        user_uuid,
        book_id,
        price_credits,
        purchased_at
      )
      values (
        ${userUuid},
        ${bookId},
        ${book.full_book_price},
        ${now}
      )
    `);

    await tx.execute(sql`
      insert into credits (
        trans_no,
        created_at,
        user_uuid,
        trans_type,
        credits,
        balance_after,
        book_id,
        remark
      )
      values (
        ${transNo},
        ${now},
        ${userUuid},
        'buy_book',
        ${-book.full_book_price},
        ${updatedCredit.balance},
        ${bookId},
        'Full book purchase'
      )
    `);

    return {
      alreadyPurchased: false,
      priceCredits: book.full_book_price,
      balanceAfter: updatedCredit.balance,
    };
  });
}

export async function purchaseChapter({
  userUuid,
  chapterId,
  transNo,
  now = new Date(),
}: PurchaseChapterInput): Promise<PurchaseResult> {
  return db().transaction(async (tx) => {
    const chapter = rowsOf<{
      book_id: number;
      is_free: boolean;
      price_credits: number | null;
      status: number;
      charge_type: number;
      default_chapter_price: number;
      allow_chapter_purchase: boolean;
    }>(
      await tx.execute(sql`
        select
          c.book_id,
          c.is_free,
          c.price_credits,
          c.status,
          b.charge_type,
          b.default_chapter_price,
          b.allow_chapter_purchase
        from chapters c
        join books b on b.id = c.book_id
        where c.id = ${chapterId}
        limit 1
      `)
    )[0];

    if (!chapter) {
      throw new Error("Chapter not found");
    }

    if (chapter.status !== 1) {
      throw new Error("Chapter is not published");
    }

    const fullBookPurchase = rowsOf<{ id: number }>(
      await tx.execute(sql`
        select id
        from user_book_purchases
        where user_uuid = ${userUuid} and book_id = ${chapter.book_id}
        limit 1
      `)
    )[0];

    if (fullBookPurchase) {
      return {
        alreadyPurchased: true,
        priceCredits: 0,
        balanceAfter: null,
      };
    }

    const existingChapterPurchase = rowsOf<{ id: number }>(
      await tx.execute(sql`
        select id
        from user_chapter_purchases
        where user_uuid = ${userUuid} and chapter_id = ${chapterId}
        limit 1
      `)
    )[0];

    if (existingChapterPurchase) {
      return {
        alreadyPurchased: true,
        priceCredits: 0,
        balanceAfter: null,
      };
    }

    const priceCredits =
      chapter.price_credits ?? chapter.default_chapter_price;

    if (chapter.is_free || chapter.charge_type === 1 || priceCredits <= 0) {
      return {
        alreadyPurchased: false,
        priceCredits: 0,
        balanceAfter: null,
      };
    }

    if (!chapter.allow_chapter_purchase || ![2, 4].includes(chapter.charge_type)) {
      throw new Error("This chapter cannot be purchased separately");
    }

    const credit = rowsOf<{ balance: number }>(
      await tx.execute(sql`
        select balance
        from user_credits
        where user_uuid = ${userUuid}
        for update
      `)
    )[0];

    if (!credit) {
      throw new Error("User credit account not found");
    }

    const fullBookPurchaseAfterLock = rowsOf<{ id: number }>(
      await tx.execute(sql`
        select id
        from user_book_purchases
        where user_uuid = ${userUuid} and book_id = ${chapter.book_id}
        limit 1
      `)
    )[0];

    if (fullBookPurchaseAfterLock) {
      return {
        alreadyPurchased: true,
        priceCredits: 0,
        balanceAfter: credit.balance,
      };
    }

    const chapterPurchaseAfterLock = rowsOf<{ id: number }>(
      await tx.execute(sql`
        select id
        from user_chapter_purchases
        where user_uuid = ${userUuid} and chapter_id = ${chapterId}
        limit 1
      `)
    )[0];

    if (chapterPurchaseAfterLock) {
      return {
        alreadyPurchased: true,
        priceCredits: 0,
        balanceAfter: credit.balance,
      };
    }

    if (credit.balance < priceCredits) {
      throw new Error("Insufficient credits");
    }

    const updatedCredit = rowsOf<{ balance: number }>(
      await tx.execute(sql`
        update user_credits
        set
          balance = balance - ${priceCredits},
          total_spent = total_spent + ${priceCredits},
          updated_at = ${now}
        where user_uuid = ${userUuid} and balance >= ${priceCredits}
        returning balance
      `)
    )[0];

    if (!updatedCredit) {
      throw new Error("Insufficient credits");
    }

    await tx.execute(sql`
      insert into user_chapter_purchases (
        user_uuid,
        book_id,
        chapter_id,
        price_credits,
        purchased_at
      )
      values (
        ${userUuid},
        ${chapter.book_id},
        ${chapterId},
        ${priceCredits},
        ${now}
      )
    `);

    await tx.execute(sql`
      insert into credits (
        trans_no,
        created_at,
        user_uuid,
        trans_type,
        credits,
        balance_after,
        book_id,
        chapter_id,
        remark
      )
      values (
        ${transNo},
        ${now},
        ${userUuid},
        'buy_chapter',
        ${-priceCredits},
        ${updatedCredit.balance},
        ${chapter.book_id},
        ${chapterId},
        'Chapter purchase'
      )
    `);

    return {
      alreadyPurchased: false,
      priceCredits,
      balanceAfter: updatedCredit.balance,
    };
  });
}

export async function canReadChapter(
  userUuid: string,
  chapterId: number
): Promise<AccessResult> {
  const access = rowsOf<{
    is_free: boolean;
    charge_type: number;
    price_credits: number | null;
    default_chapter_price: number;
    full_book_purchased: boolean;
    chapter_purchased: boolean;
  }>(
    await db().execute(sql`
      select
        c.is_free,
        b.charge_type,
        c.price_credits,
        b.default_chapter_price,
        exists (
          select 1
          from user_book_purchases ubp
          where ubp.user_uuid = ${userUuid}
            and ubp.book_id = c.book_id
        ) as full_book_purchased,
        exists (
          select 1
          from user_chapter_purchases ucp
          where ucp.user_uuid = ${userUuid}
            and ucp.chapter_id = c.id
        ) as chapter_purchased
      from chapters c
      join books b on b.id = c.book_id
      where c.id = ${chapterId}
        and c.status = 1
      limit 1
    `)
  )[0];

  if (!access) {
    return {
      canRead: false,
      reason: "requires_purchase",
      priceCredits: 0,
    };
  }

  const priceCredits = access.price_credits ?? access.default_chapter_price;

  if (access.is_free) {
    return { canRead: true, reason: "free", priceCredits: 0 };
  }

  if (access.charge_type === 1 || priceCredits <= 0) {
    return { canRead: true, reason: "book_free", priceCredits: 0 };
  }

  if (access.full_book_purchased) {
    return { canRead: true, reason: "full_book_purchased", priceCredits: 0 };
  }

  if (access.chapter_purchased) {
    return { canRead: true, reason: "chapter_purchased", priceCredits: 0 };
  }

  return {
    canRead: false,
    reason: "requires_purchase",
    priceCredits,
  };
}
