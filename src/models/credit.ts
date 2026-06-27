import { credits, user_credits } from "@/db/schema";
import { db } from "@/db";
import { desc, eq, and, gte, asc, sql } from "drizzle-orm";

function rowsOf<T>(result: unknown): T[] {
  if (Array.isArray(result)) {
    return result as T[];
  }

  const maybeRows = (result as { rows?: unknown[] } | null)?.rows;
  return Array.isArray(maybeRows) ? (maybeRows as T[]) : [];
}

export async function insertCredit(
  data: typeof credits.$inferInsert
): Promise<typeof credits.$inferSelect | undefined> {
  if (data.created_at && typeof data.created_at === "string") {
    data.created_at = new Date(data.created_at);
  }
  if (data.expired_at && typeof data.expired_at === "string") {
    data.expired_at = new Date(data.expired_at);
  }

  const credit = await db().transaction(async (tx) => {
    const creditDelta = data.credits || 0;
    const now = data.created_at || new Date();
    let balanceAfter = data.balance_after ?? null;

    if (data.user_uuid && creditDelta > 0) {
      const [balance] = rowsOf<{ balance: number }>(
        await tx.execute(sql`
          insert into user_credits (
            user_uuid,
            balance,
            total_earned,
            total_spent,
            updated_at
          )
          values (
            ${data.user_uuid},
            ${creditDelta},
            ${creditDelta},
            0,
            ${now}
          )
          on conflict (user_uuid) do update set
            balance = user_credits.balance + ${creditDelta},
            total_earned = user_credits.total_earned + ${creditDelta},
            updated_at = ${now}
          returning balance
        `)
      );

      balanceAfter = balance.balance;
    }

    if (data.user_uuid && creditDelta < 0) {
      const cost = Math.abs(creditDelta);
      const [balance] = rowsOf<{ balance: number }>(
        await tx.execute(sql`
          update user_credits
          set
            balance = balance - ${cost},
            total_spent = total_spent + ${cost},
            updated_at = ${now}
          where user_uuid = ${data.user_uuid}
            and balance >= ${cost}
          returning balance
        `)
      );

      if (!balance) {
        throw new Error("Insufficient credits");
      }

      balanceAfter = balance.balance;
    }

    const [credit] = await tx
      .insert(credits)
      .values({
        ...data,
        balance_after: balanceAfter,
      })
      .returning();

    return credit;
  });

  return credit;
}

export async function getUserCreditBalance(
  user_uuid: string
): Promise<typeof user_credits.$inferSelect | undefined> {
  const [credit] = await db()
    .select()
    .from(user_credits)
    .where(eq(user_credits.user_uuid, user_uuid))
    .limit(1);

  return credit;
}

export async function findCreditByTransNo(
  trans_no: string
): Promise<typeof credits.$inferSelect | undefined> {
  const [credit] = await db()
    .select()
    .from(credits)
    .where(eq(credits.trans_no, trans_no))
    .limit(1);

  return credit;
}

export async function findCreditByOrderNo(
  order_no: string
): Promise<typeof credits.$inferSelect | undefined> {
  const [credit] = await db()
    .select()
    .from(credits)
    .where(eq(credits.order_no, order_no))
    .limit(1);

  return credit;
}

export async function getUserValidCredits(
  user_uuid: string
): Promise<(typeof credits.$inferSelect)[] | undefined> {
  const now = new Date().toISOString();
  const data = await db()
    .select()
    .from(credits)
    .where(
      and(
        gte(credits.expired_at, new Date(now)),
        eq(credits.user_uuid, user_uuid)
      )
    )
    .orderBy(asc(credits.expired_at));

  return data;
}

export async function getCreditsByUserUuid(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<(typeof credits.$inferSelect)[] | undefined> {
  const data = await db()
    .select()
    .from(credits)
    .where(eq(credits.user_uuid, user_uuid))
    .orderBy(desc(credits.created_at))
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}
