import "dotenv/config";
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { db } from "../src/db";

config({ path: ".env" });
config({ path: ".env.development" });
config({ path: ".env.local" });

async function main() {
  await db().execute(sql`
    insert into user_credits (
      user_uuid,
      balance,
      total_earned,
      total_spent,
      updated_at
    )
    select
      u.uuid as user_uuid,
      greatest(
        coalesce(
          sum(c.credits) filter (
            where c.expired_at is null or c.expired_at >= now()
          ),
          0
        ),
        0
      )::integer as balance,
      coalesce(
        sum(c.credits) filter (where c.credits > 0),
        0
      )::integer as total_earned,
      abs(
        coalesce(
          sum(c.credits) filter (where c.credits < 0),
          0
        )
      )::integer as total_spent,
      now() as updated_at
    from users u
    left join credits c on c.user_uuid = u.uuid
    group by u.uuid
    on conflict (user_uuid) do update set
      balance = excluded.balance,
      total_earned = excluded.total_earned,
      total_spent = excluded.total_spent,
      updated_at = excluded.updated_at
  `);

  console.log("Synced user_credits from credits ledger.");
}

main().catch((error) => {
  console.error("Sync user credits failed:", error);
  process.exit(1);
});
