import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "drizzle-orm";

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`

ALTER TABLE "survey_net_promoter" ADD COLUMN IF NOT EXISTS "customer_feedback_number" numeric;`);
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`

ALTER TABLE "survey_net_promoter" DROP COLUMN IF EXISTS "customer_feedback_number";`);
}
