import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "employee_responses" ADD COLUMN "department" varchar;
ALTER TABLE "employee_responses" ADD COLUMN "department_sub" varchar;
ALTER TABLE "employee_benefits_benefits" ADD COLUMN "printemps" varchar;
ALTER TABLE "employee_benefits_benefits" ADD COLUMN "dohaoasis" varchar;
ALTER TABLE "employee_benefits_benefits" ADD COLUMN "banyantree" varchar;
ALTER TABLE "_employee_benefits_v_version_benefits" ADD COLUMN "printemps" varchar;
ALTER TABLE "_employee_benefits_v_version_benefits" ADD COLUMN "dohaoasis" varchar;
ALTER TABLE "_employee_benefits_v_version_benefits" ADD COLUMN "banyantree" varchar;`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "employee_responses" DROP COLUMN IF EXISTS "department";
ALTER TABLE "employee_responses" DROP COLUMN IF EXISTS "department_sub";
ALTER TABLE "employee_benefits_benefits" DROP COLUMN IF EXISTS "printemps";
ALTER TABLE "employee_benefits_benefits" DROP COLUMN IF EXISTS "dohaoasis";
ALTER TABLE "employee_benefits_benefits" DROP COLUMN IF EXISTS "banyantree";
ALTER TABLE "_employee_benefits_v_version_benefits" DROP COLUMN IF EXISTS "printemps";
ALTER TABLE "_employee_benefits_v_version_benefits" DROP COLUMN IF EXISTS "dohaoasis";
ALTER TABLE "_employee_benefits_v_version_benefits" DROP COLUMN IF EXISTS "banyantree";`);

};
