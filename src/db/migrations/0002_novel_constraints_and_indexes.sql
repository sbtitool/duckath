DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_credits_user_uuid_users_uuid_fk') THEN
		ALTER TABLE "user_credits" ADD CONSTRAINT "user_credits_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_book_purchases_user_uuid_users_uuid_fk') THEN
		ALTER TABLE "user_book_purchases" ADD CONSTRAINT "user_book_purchases_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_chapter_purchases_user_uuid_users_uuid_fk') THEN
		ALTER TABLE "user_chapter_purchases" ADD CONSTRAINT "user_chapter_purchases_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookshelf_user_uuid_users_uuid_fk') THEN
		ALTER TABLE "bookshelf" ADD CONSTRAINT "bookshelf_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reading_progress_user_uuid_users_uuid_fk') THEN
		ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'credits_balance_after_check') THEN
		ALTER TABLE "credits" ADD CONSTRAINT "credits_balance_after_check" CHECK ("balance_after" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_credits_balance_check') THEN
		ALTER TABLE "user_credits" ADD CONSTRAINT "user_credits_balance_check" CHECK ("balance" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_credits_total_earned_check') THEN
		ALTER TABLE "user_credits" ADD CONSTRAINT "user_credits_total_earned_check" CHECK ("total_earned" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_credits_total_spent_check') THEN
		ALTER TABLE "user_credits" ADD CONSTRAINT "user_credits_total_spent_check" CHECK ("total_spent" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_status_check') THEN
		ALTER TABLE "books" ADD CONSTRAINT "books_status_check" CHECK ("book_status" IN (1, 2, 3, 4));
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_charge_type_check') THEN
		ALTER TABLE "books" ADD CONSTRAINT "books_charge_type_check" CHECK ("charge_type" IN (1, 2, 3, 4));
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_default_chapter_price_check') THEN
		ALTER TABLE "books" ADD CONSTRAINT "books_default_chapter_price_check" CHECK ("default_chapter_price" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_full_book_price_check') THEN
		ALTER TABLE "books" ADD CONSTRAINT "books_full_book_price_check" CHECK ("full_book_price" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_full_purchase_status_check') THEN
		ALTER TABLE "books" ADD CONSTRAINT "books_full_purchase_status_check" CHECK ("allow_full_purchase" = false OR "book_status" = 2);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_chapter_count_check') THEN
		ALTER TABLE "books" ADD CONSTRAINT "books_chapter_count_check" CHECK ("chapter_count" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_word_count_check') THEN
		ALTER TABLE "books" ADD CONSTRAINT "books_word_count_check" CHECK ("word_count" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_view_count_check') THEN
		ALTER TABLE "books" ADD CONSTRAINT "books_view_count_check" CHECK ("view_count" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_bookmark_count_check') THEN
		ALTER TABLE "books" ADD CONSTRAINT "books_bookmark_count_check" CHECK ("bookmark_count" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_rating_score_check') THEN
		ALTER TABLE "books" ADD CONSTRAINT "books_rating_score_check" CHECK ("rating_score" >= 0 AND "rating_score" <= 500);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_rating_count_check') THEN
		ALTER TABLE "books" ADD CONSTRAINT "books_rating_count_check" CHECK ("rating_count" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'books_copyright_status_check') THEN
		ALTER TABLE "books" ADD CONSTRAINT "books_copyright_status_check" CHECK ("copyright_status" IN (1, 2, 3));
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chapters_chapter_no_check') THEN
		ALTER TABLE "chapters" ADD CONSTRAINT "chapters_chapter_no_check" CHECK ("chapter_no" > 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chapters_price_credits_check') THEN
		ALTER TABLE "chapters" ADD CONSTRAINT "chapters_price_credits_check" CHECK ("price_credits" IS NULL OR "price_credits" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chapters_status_check') THEN
		ALTER TABLE "chapters" ADD CONSTRAINT "chapters_status_check" CHECK ("status" IN (0, 1, 2));
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chapters_word_count_check') THEN
		ALTER TABLE "chapters" ADD CONSTRAINT "chapters_word_count_check" CHECK ("word_count" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chapters_view_count_check') THEN
		ALTER TABLE "chapters" ADD CONSTRAINT "chapters_view_count_check" CHECK ("view_count" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'genres_sort_order_check') THEN
		ALTER TABLE "genres" ADD CONSTRAINT "genres_sort_order_check" CHECK ("sort_order" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_book_purchases_price_check') THEN
		ALTER TABLE "user_book_purchases" ADD CONSTRAINT "user_book_purchases_price_check" CHECK ("price_credits" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_chapter_purchases_price_check') THEN
		ALTER TABLE "user_chapter_purchases" ADD CONSTRAINT "user_chapter_purchases_price_check" CHECK ("price_credits" >= 0);
	END IF;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "books_status_latest_idx" ON "books" USING btree ("book_status","latest_chapter_at");
CREATE INDEX IF NOT EXISTS "chapters_book_status_order_idx" ON "chapters" USING btree ("book_id","status","chapter_no");
CREATE INDEX IF NOT EXISTS "chapters_status_latest_idx" ON "chapters" USING btree ("status","published_at");
