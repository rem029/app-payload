import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

CREATE TABLE IF NOT EXISTS "employee_benefits_attachments" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS "_employee_benefits_v_version_attachments" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_uuid" varchar
);

CREATE INDEX IF NOT EXISTS "employee_benefits_attachments_order_idx" ON "employee_benefits_attachments" ("_order");
CREATE INDEX IF NOT EXISTS "employee_benefits_attachments_parent_id_idx" ON "employee_benefits_attachments" ("_parent_id");
CREATE INDEX IF NOT EXISTS "_employee_benefits_v_version_attachments_order_idx" ON "_employee_benefits_v_version_attachments" ("_order");
CREATE INDEX IF NOT EXISTS "_employee_benefits_v_version_attachments_parent_id_idx" ON "_employee_benefits_v_version_attachments" ("_parent_id");
DO $$ BEGIN
 ALTER TABLE "employee_benefits_attachments" ADD CONSTRAINT "employee_benefits_attachments__parent_id_employee_benefits_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "employee_benefits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_employee_benefits_v_version_attachments" ADD CONSTRAINT "_employee_benefits_v_version_attachments__parent_id__employee_benefits_v_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_employee_benefits_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "employee_benefits_attachments";
DROP TABLE "_employee_benefits_v_version_attachments";`);

};
