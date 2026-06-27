ALTER TABLE "credits" ADD COLUMN IF NOT EXISTS "balance_after" integer;
ALTER TABLE "credits" ADD COLUMN IF NOT EXISTS "book_id" integer;
ALTER TABLE "credits" ADD COLUMN IF NOT EXISTS "chapter_id" integer;
ALTER TABLE "credits" ADD COLUMN IF NOT EXISTS "remark" text;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_credits" (
	"user_uuid" varchar(255) PRIMARY KEY NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"total_earned" integer DEFAULT 0 NOT NULL,
	"total_spent" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "books" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "books_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"original_title" varchar(255),
	"author_name" varchar(255),
	"cover_url" varchar(500),
	"book_status" integer DEFAULT 1 NOT NULL,
	"charge_type" integer DEFAULT 1 NOT NULL,
	"default_chapter_price" integer DEFAULT 0 NOT NULL,
	"full_book_price" integer DEFAULT 0 NOT NULL,
	"allow_chapter_purchase" boolean DEFAULT true NOT NULL,
	"allow_full_purchase" boolean DEFAULT false NOT NULL,
	"chapter_count" integer DEFAULT 0 NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"latest_chapter_id" integer,
	"latest_chapter_title" varchar(255),
	"latest_chapter_at" timestamp with time zone,
	"view_count" integer DEFAULT 0 NOT NULL,
	"bookmark_count" integer DEFAULT 0 NOT NULL,
	"rating_score" integer DEFAULT 0 NOT NULL,
	"rating_count" integer DEFAULT 0 NOT NULL,
	"is_recommended" boolean DEFAULT false NOT NULL,
	"recommend_sort" integer DEFAULT 0 NOT NULL,
	"copyright_status" integer DEFAULT 1 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "books_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "books_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "book_details" (
	"book_id" integer PRIMARY KEY NOT NULL,
	"summary" text,
	"author_note" text,
	"copyright_notice" text,
	"seo_title" varchar(255),
	"seo_description" varchar(500),
	"source_url" varchar(500),
	"source_book_id" varchar(255),
	"updated_at" timestamp with time zone,
	CONSTRAINT "book_details_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chapters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chapters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"book_id" integer NOT NULL,
	"chapter_no" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"is_free" boolean DEFAULT false NOT NULL,
	"price_credits" integer,
	"status" integer DEFAULT 1 NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"source_chapter_id" varchar(255),
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "chapters_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chapter_contents" (
	"chapter_id" integer PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"content" text NOT NULL,
	"content_text" text,
	"updated_at" timestamp with time zone,
	CONSTRAINT "chapter_contents_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "chapter_contents_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genres" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "genres_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(80) NOT NULL,
	"slug" varchar(80) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "genres_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "book_genres" (
	"book_id" integer NOT NULL,
	"genre_id" integer NOT NULL,
	CONSTRAINT "book_genres_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "book_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_book_purchases" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_book_purchases_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_uuid" varchar(255) NOT NULL,
	"book_id" integer NOT NULL,
	"price_credits" integer NOT NULL,
	"purchased_at" timestamp with time zone,
	CONSTRAINT "user_book_purchases_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_chapter_purchases" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_chapter_purchases_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_uuid" varchar(255) NOT NULL,
	"book_id" integer NOT NULL,
	"chapter_id" integer NOT NULL,
	"price_credits" integer NOT NULL,
	"purchased_at" timestamp with time zone,
	CONSTRAINT "user_chapter_purchases_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "user_chapter_purchases_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookshelf" (
	"user_uuid" varchar(255) NOT NULL,
	"book_id" integer NOT NULL,
	"created_at" timestamp with time zone,
	CONSTRAINT "bookshelf_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reading_progress" (
	"user_uuid" varchar(255) NOT NULL,
	"book_id" integer NOT NULL,
	"chapter_id" integer NOT NULL,
	"chapter_no" integer NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "reading_progress_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "reading_progress_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credits_user_time_idx" ON "credits" USING btree ("user_uuid","created_at");
CREATE INDEX IF NOT EXISTS "credits_book_idx" ON "credits" USING btree ("book_id");
CREATE INDEX IF NOT EXISTS "credits_chapter_idx" ON "credits" USING btree ("chapter_id");
CREATE INDEX IF NOT EXISTS "books_status_idx" ON "books" USING btree ("book_status");
CREATE INDEX IF NOT EXISTS "books_charge_idx" ON "books" USING btree ("charge_type");
CREATE INDEX IF NOT EXISTS "books_latest_idx" ON "books" USING btree ("latest_chapter_at");
CREATE INDEX IF NOT EXISTS "books_recommend_idx" ON "books" USING btree ("is_recommended","recommend_sort");
CREATE INDEX IF NOT EXISTS "books_popular_idx" ON "books" USING btree ("view_count");
CREATE INDEX IF NOT EXISTS "books_author_idx" ON "books" USING btree ("author_name");
CREATE UNIQUE INDEX IF NOT EXISTS "chapters_book_no_unique_idx" ON "chapters" USING btree ("book_id","chapter_no");
CREATE UNIQUE INDEX IF NOT EXISTS "chapters_book_slug_unique_idx" ON "chapters" USING btree ("book_id","slug");
CREATE INDEX IF NOT EXISTS "chapters_book_order_idx" ON "chapters" USING btree ("book_id","chapter_no");
CREATE INDEX IF NOT EXISTS "chapters_latest_idx" ON "chapters" USING btree ("published_at");
CREATE INDEX IF NOT EXISTS "chapters_status_idx" ON "chapters" USING btree ("status");
CREATE INDEX IF NOT EXISTS "chapter_contents_book_idx" ON "chapter_contents" USING btree ("book_id");
CREATE UNIQUE INDEX IF NOT EXISTS "book_genres_unique_idx" ON "book_genres" USING btree ("book_id","genre_id");
CREATE INDEX IF NOT EXISTS "book_genres_genre_idx" ON "book_genres" USING btree ("genre_id","book_id");
CREATE UNIQUE INDEX IF NOT EXISTS "user_book_purchases_unique_idx" ON "user_book_purchases" USING btree ("user_uuid","book_id");
CREATE INDEX IF NOT EXISTS "user_book_purchases_book_idx" ON "user_book_purchases" USING btree ("book_id");
CREATE UNIQUE INDEX IF NOT EXISTS "user_chapter_purchases_unique_idx" ON "user_chapter_purchases" USING btree ("user_uuid","chapter_id");
CREATE INDEX IF NOT EXISTS "user_chapter_purchases_user_book_idx" ON "user_chapter_purchases" USING btree ("user_uuid","book_id");
CREATE INDEX IF NOT EXISTS "user_chapter_purchases_chapter_idx" ON "user_chapter_purchases" USING btree ("chapter_id");
CREATE UNIQUE INDEX IF NOT EXISTS "bookshelf_unique_idx" ON "bookshelf" USING btree ("user_uuid","book_id");
CREATE INDEX IF NOT EXISTS "bookshelf_book_idx" ON "bookshelf" USING btree ("book_id");
CREATE UNIQUE INDEX IF NOT EXISTS "reading_progress_unique_idx" ON "reading_progress" USING btree ("user_uuid","book_id");
CREATE INDEX IF NOT EXISTS "reading_progress_user_time_idx" ON "reading_progress" USING btree ("user_uuid","updated_at");
