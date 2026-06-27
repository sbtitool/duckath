CREATE TABLE IF NOT EXISTS "tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "book_tags" (
	"book_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "book_tags_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "book_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tags_sort_order_check') THEN
		ALTER TABLE "tags" ADD CONSTRAINT "tags_sort_order_check" CHECK ("sort_order" >= 0);
	END IF;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "book_tags_unique_idx" ON "book_tags" USING btree ("book_id","tag_id");
CREATE INDEX IF NOT EXISTS "book_tags_tag_idx" ON "book_tags" USING btree ("tag_id","book_id");
