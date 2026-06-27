# Novel Database Setup

This project keeps novel data in PostgreSQL through Drizzle ORM.

## 1. Configure Database

Create an environment file in the project root:

```bash
cp .env.example .env.development
```

Set `DATABASE_URL` in `.env.development`.

## 2. Install Dependencies

```bash
pnpm install
```

## 3. Run Migrations

```bash
pnpm db:migrate
```

This creates the original ShipAny tables plus the novel tables:

- `books`
- `book_details`
- `chapters`
- `chapter_contents`
- `genres`
- `book_genres`
- `tags`
- `book_tags`
- `user_credits`
- `user_book_purchases`
- `user_chapter_purchases`
- `bookshelf`
- `reading_progress`

## 4. Seed Common Genres

```bash
pnpm db:seed:genres
```

## 5. Sync Existing Credits

ShipAny originally calculates user credits from the `credits` ledger. The novel
purchase flow uses `user_credits` for fast balance checks, so run:

```bash
pnpm db:sync:user-credits
```

Run this once after migration if the database already has users or credit
records.

## 6. Import Novels

Prepare a JSON file using this shape:

```json
{
  "genres": [
    { "name": "Fantasy", "slug": "fantasy" }
  ],
  "books": [
    {
      "title": "Example Novel",
      "slug": "example-novel",
      "author_name": "Example Author",
      "summary": "Book summary.",
      "book_status": "serializing",
      "charge_type": "chapter",
      "default_chapter_price": 10,
      "full_book_price": 0,
      "allow_chapter_purchase": true,
      "allow_full_purchase": false,
      "genres": ["fantasy"],
      "tags": ["magic-academy", "weak-to-strong"],
      "chapters": [
        {
          "chapter_no": 1,
          "title": "Chapter 1",
          "slug": "chapter-1",
          "is_free": true,
          "price_credits": 0,
          "published_at": "2026-05-08T00:00:00.000Z",
          "content": "<p>Chapter content.</p>"
        }
      ]
    }
  ]
}
```

Then run:

```bash
pnpm db:import:novels data/novels/example.json
```

## Book Status Values

- `serializing` or `1`: ongoing
- `completed` or `2`: completed
- `paused` or `3`: paused
- `hidden` or `4`: hidden

## Charge Type Values

- `free` or `1`: free book
- `chapter` or `2`: paid by chapter
- `book` or `3`: full-book purchase
- `mixed` or `4`: chapter purchase and full-book purchase

## Payment Rules

- Free chapter: `chapters.is_free = true`
- Chapter custom price: `chapters.price_credits > 0`
- Chapter uses book default price: `chapters.price_credits = null`
- Completed full-book purchase: `books.book_status = 2`, `books.allow_full_purchase = true`, `books.full_book_price > 0`
