import {
  pgTable,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  check,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Users table
export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: varchar({ length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull(),
    created_at: timestamp({ withTimezone: true }),
    nickname: varchar({ length: 255 }),
    avatar_url: varchar({ length: 255 }),
    locale: varchar({ length: 50 }),
    signin_type: varchar({ length: 50 }),
    signin_ip: varchar({ length: 255 }),
    signin_provider: varchar({ length: 50 }),
    signin_openid: varchar({ length: 255 }),
    invite_code: varchar({ length: 255 }).notNull().default(""),
    updated_at: timestamp({ withTimezone: true }),
    invited_by: varchar({ length: 255 }).notNull().default(""),
    is_affiliate: boolean().notNull().default(false),
  },
  (table) => [
    uniqueIndex("email_provider_unique_idx").on(
      table.email,
      table.signin_provider
    ),
  ]
);

// Orders table
export const orders = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  order_no: varchar({ length: 255 }).notNull().unique(),
  created_at: timestamp({ withTimezone: true }),
  user_uuid: varchar({ length: 255 }).notNull().default(""),
  user_email: varchar({ length: 255 }).notNull().default(""),
  amount: integer().notNull(),
  interval: varchar({ length: 50 }),
  expired_at: timestamp({ withTimezone: true }),
  status: varchar({ length: 50 }).notNull(),
  stripe_session_id: varchar({ length: 255 }),
  credits: integer().notNull(),
  currency: varchar({ length: 50 }),
  sub_id: varchar({ length: 255 }),
  sub_interval_count: integer(),
  sub_cycle_anchor: integer(),
  sub_period_end: integer(),
  sub_period_start: integer(),
  sub_times: integer(),
  product_id: varchar({ length: 255 }),
  product_name: varchar({ length: 255 }),
  valid_months: integer(),
  order_detail: text(),
  paid_at: timestamp({ withTimezone: true }),
  paid_email: varchar({ length: 255 }),
  paid_detail: text(),
});

// API Keys table
export const apikeys = pgTable("apikeys", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  api_key: varchar({ length: 255 }).notNull().unique(),
  title: varchar({ length: 100 }),
  user_uuid: varchar({ length: 255 }).notNull(),
  created_at: timestamp({ withTimezone: true }),
  status: varchar({ length: 50 }),
});

// Credits ledger table
export const credits = pgTable(
  "credits",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    trans_no: varchar({ length: 255 }).notNull().unique(),
    created_at: timestamp({ withTimezone: true }),
    user_uuid: varchar({ length: 255 }).notNull(),
    trans_type: varchar({ length: 50 }).notNull(),
    credits: integer().notNull(),
    balance_after: integer(),
    order_no: varchar({ length: 255 }),
    book_id: integer(),
    chapter_id: integer(),
    remark: text(),
    expired_at: timestamp({ withTimezone: true }),
  },
  (table) => [
    index("credits_user_time_idx").on(table.user_uuid, table.created_at),
    index("credits_book_idx").on(table.book_id),
    index("credits_chapter_idx").on(table.chapter_id),
    check("credits_balance_after_check", sql`${table.balance_after} >= 0`),
  ]
);

// User credit balance table for fast balance lookup
export const user_credits = pgTable(
  "user_credits",
  {
    user_uuid: varchar({ length: 255 })
      .primaryKey()
      .references(() => users.uuid, { onDelete: "cascade" }),
    balance: integer().notNull().default(0),
    total_earned: integer().notNull().default(0),
    total_spent: integer().notNull().default(0),
    updated_at: timestamp({ withTimezone: true }),
  },
  (table) => [
    check("user_credits_balance_check", sql`${table.balance} >= 0`),
    check(
      "user_credits_total_earned_check",
      sql`${table.total_earned} >= 0`
    ),
    check("user_credits_total_spent_check", sql`${table.total_spent} >= 0`),
  ]
);

// Books table: list, search, ranking, and payment metadata
export const books = pgTable(
  "books",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: varchar({ length: 255 }).notNull().unique(),
    slug: varchar({ length: 255 }).notNull().unique(),
    title: varchar({ length: 255 }).notNull(),
    original_title: varchar({ length: 255 }),
    author_name: varchar({ length: 255 }),
    cover_url: varchar({ length: 500 }),

    book_status: integer().notNull().default(1),
    // 1=serializing, 2=completed, 3=paused, 4=hidden

    charge_type: integer().notNull().default(1),
    // 1=free, 2=chapter, 3=book, 4=mixed

    default_chapter_price: integer().notNull().default(0),
    full_book_price: integer().notNull().default(0),
    allow_chapter_purchase: boolean().notNull().default(true),
    allow_full_purchase: boolean().notNull().default(false),

    chapter_count: integer().notNull().default(0),
    word_count: integer().notNull().default(0),
    latest_chapter_id: integer(),
    latest_chapter_title: varchar({ length: 255 }),
    latest_chapter_at: timestamp({ withTimezone: true }),

    view_count: integer().notNull().default(0),
    bookmark_count: integer().notNull().default(0),
    rating_score: integer().notNull().default(0),
    // Store rating * 100, e.g. 452 means 4.52.
    rating_count: integer().notNull().default(0),

    is_recommended: boolean().notNull().default(false),
    recommend_sort: integer().notNull().default(0),

    copyright_status: integer().notNull().default(1),
    // 1=owned, 2=authorized, 3=expired

    published_at: timestamp({ withTimezone: true }),
    created_at: timestamp({ withTimezone: true }),
    updated_at: timestamp({ withTimezone: true }),
  },
  (table) => [
    index("books_status_idx").on(table.book_status),
    index("books_charge_idx").on(table.charge_type),
    index("books_latest_idx").on(table.latest_chapter_at),
    index("books_recommend_idx").on(table.is_recommended, table.recommend_sort),
    index("books_popular_idx").on(table.view_count),
    index("books_author_idx").on(table.author_name),
    index("books_status_latest_idx").on(
      table.book_status,
      table.latest_chapter_at
    ),
    check("books_status_check", sql`${table.book_status} in (1, 2, 3, 4)`),
    check("books_charge_type_check", sql`${table.charge_type} in (1, 2, 3, 4)`),
    check(
      "books_default_chapter_price_check",
      sql`${table.default_chapter_price} >= 0`
    ),
    check("books_full_book_price_check", sql`${table.full_book_price} >= 0`),
    check(
      "books_full_purchase_status_check",
      sql`${table.allow_full_purchase} = false or ${table.book_status} = 2`
    ),
    check("books_chapter_count_check", sql`${table.chapter_count} >= 0`),
    check("books_word_count_check", sql`${table.word_count} >= 0`),
    check("books_view_count_check", sql`${table.view_count} >= 0`),
    check("books_bookmark_count_check", sql`${table.bookmark_count} >= 0`),
    check(
      "books_rating_score_check",
      sql`${table.rating_score} >= 0 and ${table.rating_score} <= 500`
    ),
    check("books_rating_count_check", sql`${table.rating_count} >= 0`),
    check(
      "books_copyright_status_check",
      sql`${table.copyright_status} in (1, 2, 3)`
    ),
  ]
);

// Book details table: long text kept out of list queries
export const book_details = pgTable("book_details", {
  book_id: integer()
    .primaryKey()
    .references(() => books.id, { onDelete: "cascade" }),
  summary: text(),
  author_note: text(),
  copyright_notice: text(),
  seo_title: varchar({ length: 255 }),
  seo_description: varchar({ length: 500 }),
  source_url: varchar({ length: 500 }),
  source_book_id: varchar({ length: 255 }),
  updated_at: timestamp({ withTimezone: true }),
});

// Chapters table: catalog and payment fields only, no large content
export const chapters = pgTable(
  "chapters",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    book_id: integer()
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    chapter_no: integer().notNull(),
    title: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull(),

    is_free: boolean().notNull().default(false),
    price_credits: integer(),
    // null=use books.default_chapter_price, 0=free, >0=custom price

    status: integer().notNull().default(1),
    // 0=draft, 1=published, 2=locked

    word_count: integer().notNull().default(0),
    view_count: integer().notNull().default(0),
    source_chapter_id: varchar({ length: 255 }),

    published_at: timestamp({ withTimezone: true }),
    created_at: timestamp({ withTimezone: true }),
    updated_at: timestamp({ withTimezone: true }),
  },
  (table) => [
    uniqueIndex("chapters_book_no_unique_idx").on(
      table.book_id,
      table.chapter_no
    ),
    uniqueIndex("chapters_book_slug_unique_idx").on(table.book_id, table.slug),
    index("chapters_book_order_idx").on(table.book_id, table.chapter_no),
    index("chapters_latest_idx").on(table.published_at),
    index("chapters_status_idx").on(table.status),
    index("chapters_book_status_order_idx").on(
      table.book_id,
      table.status,
      table.chapter_no
    ),
    index("chapters_status_latest_idx").on(table.status, table.published_at),
    check("chapters_chapter_no_check", sql`${table.chapter_no} > 0`),
    check(
      "chapters_price_credits_check",
      sql`${table.price_credits} is null or ${table.price_credits} >= 0`
    ),
    check("chapters_status_check", sql`${table.status} in (0, 1, 2)`),
    check("chapters_word_count_check", sql`${table.word_count} >= 0`),
    check("chapters_view_count_check", sql`${table.view_count} >= 0`),
  ]
);

// Chapter content table: read page loads this table only when needed
export const chapter_contents = pgTable(
  "chapter_contents",
  {
    chapter_id: integer()
      .primaryKey()
      .references(() => chapters.id, { onDelete: "cascade" }),
    book_id: integer()
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    content: text().notNull(),
    content_text: text(),
    updated_at: timestamp({ withTimezone: true }),
  },
  (table) => [index("chapter_contents_book_idx").on(table.book_id)]
);

// Genres table
export const genres = pgTable(
  "genres",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 80 }).notNull(),
    slug: varchar({ length: 80 }).notNull().unique(),
    sort_order: integer().notNull().default(0),
  },
  (table) => [
    check("genres_sort_order_check", sql`${table.sort_order} >= 0`),
  ]
);

// Books can belong to multiple genres
export const book_genres = pgTable(
  "book_genres",
  {
    book_id: integer()
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    genre_id: integer()
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("book_genres_unique_idx").on(table.book_id, table.genre_id),
    index("book_genres_genre_idx").on(table.genre_id, table.book_id),
  ]
);

// Tags table: finer-grained novel attributes from source sites
export const tags = pgTable(
  "tags",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 100 }).notNull().unique(),
    sort_order: integer().notNull().default(0),
  },
  (table) => [
    check("tags_sort_order_check", sql`${table.sort_order} >= 0`),
  ]
);

// Books can belong to multiple tags
export const book_tags = pgTable(
  "book_tags",
  {
    book_id: integer()
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    tag_id: integer()
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("book_tags_unique_idx").on(table.book_id, table.tag_id),
    index("book_tags_tag_idx").on(table.tag_id, table.book_id),
  ]
);

// Full-book purchases
export const user_book_purchases = pgTable(
  "user_book_purchases",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_uuid: varchar({ length: 255 })
      .notNull()
      .references(() => users.uuid, { onDelete: "cascade" }),
    book_id: integer()
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    price_credits: integer().notNull(),
    purchased_at: timestamp({ withTimezone: true }),
  },
  (table) => [
    uniqueIndex("user_book_purchases_unique_idx").on(
      table.user_uuid,
      table.book_id
    ),
    index("user_book_purchases_book_idx").on(table.book_id),
    check(
      "user_book_purchases_price_check",
      sql`${table.price_credits} >= 0`
    ),
  ]
);

// Single-chapter purchases
export const user_chapter_purchases = pgTable(
  "user_chapter_purchases",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_uuid: varchar({ length: 255 })
      .notNull()
      .references(() => users.uuid, { onDelete: "cascade" }),
    book_id: integer()
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    chapter_id: integer()
      .notNull()
      .references(() => chapters.id, { onDelete: "cascade" }),
    price_credits: integer().notNull(),
    purchased_at: timestamp({ withTimezone: true }),
  },
  (table) => [
    uniqueIndex("user_chapter_purchases_unique_idx").on(
      table.user_uuid,
      table.chapter_id
    ),
    index("user_chapter_purchases_user_book_idx").on(
      table.user_uuid,
      table.book_id
    ),
    index("user_chapter_purchases_chapter_idx").on(table.chapter_id),
    check(
      "user_chapter_purchases_price_check",
      sql`${table.price_credits} >= 0`
    ),
  ]
);

// User bookshelf
export const bookshelf = pgTable(
  "bookshelf",
  {
    user_uuid: varchar({ length: 255 })
      .notNull()
      .references(() => users.uuid, { onDelete: "cascade" }),
    book_id: integer()
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    created_at: timestamp({ withTimezone: true }),
  },
  (table) => [
    uniqueIndex("bookshelf_unique_idx").on(table.user_uuid, table.book_id),
    index("bookshelf_book_idx").on(table.book_id),
  ]
);

// User reading progress
export const reading_progress = pgTable(
  "reading_progress",
  {
    user_uuid: varchar({ length: 255 })
      .notNull()
      .references(() => users.uuid, { onDelete: "cascade" }),
    book_id: integer()
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    chapter_id: integer()
      .notNull()
      .references(() => chapters.id, { onDelete: "cascade" }),
    chapter_no: integer().notNull(),
    updated_at: timestamp({ withTimezone: true }),
  },
  (table) => [
    uniqueIndex("reading_progress_unique_idx").on(
      table.user_uuid,
      table.book_id
    ),
    index("reading_progress_user_time_idx").on(
      table.user_uuid,
      table.updated_at
    ),
  ]
);

// Posts table
export const posts = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: varchar({ length: 255 }).notNull().unique(),
  slug: varchar({ length: 255 }),
  title: varchar({ length: 255 }),
  description: text(),
  content: text(),
  created_at: timestamp({ withTimezone: true }),
  updated_at: timestamp({ withTimezone: true }),
  status: varchar({ length: 50 }),
  cover_url: varchar({ length: 255 }),
  author_name: varchar({ length: 255 }),
  author_avatar_url: varchar({ length: 255 }),
  locale: varchar({ length: 50 }),
});

// Affiliates table
export const affiliates = pgTable("affiliates", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_uuid: varchar({ length: 255 }).notNull(),
  created_at: timestamp({ withTimezone: true }),
  status: varchar({ length: 50 }).notNull().default(""),
  invited_by: varchar({ length: 255 }).notNull(),
  paid_order_no: varchar({ length: 255 }).notNull().default(""),
  paid_amount: integer().notNull().default(0),
  reward_percent: integer().notNull().default(0),
  reward_amount: integer().notNull().default(0),
});

// Feedbacks table
export const feedbacks = pgTable("feedbacks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  created_at: timestamp({ withTimezone: true }),
  status: varchar({ length: 50 }),
  user_uuid: varchar({ length: 255 }),
  content: text(),
  rating: integer(),
});
