import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "employee_benefits" RENAME COLUMN "general_info_name" TO "name";
ALTER TABLE "_employee_benefits_v" RENAME COLUMN "version_general_info_name" TO "version_name";`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "employee_benefits" RENAME COLUMN "name" TO "general_info_name";
ALTER TABLE "_employee_benefits_v" RENAME COLUMN "version_name" TO "version_general_info_name";`);

};
