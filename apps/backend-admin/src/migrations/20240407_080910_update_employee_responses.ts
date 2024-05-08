import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "drizzle-orm";

const dbValue = [
  { old: "very-low", new: "strongly-disagree" },
  { old: "low", new: "disagree" },
  { old: "neutral", new: "i-do-not-know" },
  { old: "high", new: "agree" },
  { old: "very-high", new: "strongly-agree" },
];

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  for (let queryIndex: number = 0; queryIndex < dbValue.length; queryIndex++) {
    const item = dbValue[queryIndex];

    await payload.db.drizzle.execute(sql`
        UPDATE employee_responses_questions
        SET response = ${item.new}
        WHERE response = ${item.old}
    `);
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  for (let queryIndex: number = 0; queryIndex < dbValue.length; queryIndex++) {
    const item = dbValue[queryIndex];

    await payload.db.drizzle.execute(sql`
              UPDATE employee_responses_questions
              SET response = ${item.old}
              WHERE response = ${item.new}
          `);
  }
}
