import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "drizzle-orm";

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
        UPDATE survey_net_promoter
        SET customer_feedback_number  = 8
        WHERE customer_feedback = 'promoter'
    `);

  await payload.db.drizzle.execute(sql`
    UPDATE survey_net_promoter
    SET customer_feedback_number  = 5
    WHERE customer_feedback = 'neutral'
`);

  await payload.db.drizzle.execute(sql`
    UPDATE survey_net_promoter
    SET customer_feedback_number  = 1
    WHERE customer_feedback = 'detractor'
`);
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
        UPDATE survey_net_promoter
        SET customer_feedback_number = null
    `);
}
