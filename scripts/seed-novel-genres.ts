import "dotenv/config";
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { db } from "../src/db";

config({ path: ".env" });
config({ path: ".env.development" });
config({ path: ".env.local" });

const genres = [
  ["Action", "action"],
  ["Adventure", "adventure"],
  ["Comedy", "comedy"],
  ["Drama", "drama"],
  ["Fantasy", "fantasy"],
  ["Harem", "harem"],
  ["Historical", "historical"],
  ["Horror", "horror"],
  ["Josei", "josei"],
  ["Martial Arts", "martial-arts"],
  ["Mystery", "mystery"],
  ["Psychological", "psychological"],
  ["Romance", "romance"],
  ["School Life", "school-life"],
  ["Sci-fi", "sci-fi"],
  ["Seinen", "seinen"],
  ["Shoujo", "shoujo"],
  ["Shounen", "shounen"],
  ["Slice of Life", "slice-of-life"],
  ["Supernatural", "supernatural"],
  ["Tragedy", "tragedy"],
  ["Wuxia", "wuxia"],
  ["Xianxia", "xianxia"],
  ["Xuanhuan", "xuanhuan"],
];

async function main() {
  for (let i = 0; i < genres.length; i += 1) {
    const [name, slug] = genres[i];

    await db().execute(sql`
      insert into genres (name, slug, sort_order)
      values (${name}, ${slug}, ${i + 1})
      on conflict (slug) do update set
        name = excluded.name,
        sort_order = excluded.sort_order
    `);
  }

  console.log(`Seeded ${genres.length} novel genres.`);
}

main().catch((error) => {
  console.error("Seed novel genres failed:", error);
  process.exit(1);
});
