import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "department_rels";
DROP TABLE "department_sub";
ALTER TABLE "department_department_subs" ADD COLUMN "department_sub" varchar;`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

CREATE TABLE IF NOT EXISTS "department_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"department_sub_id" integer
);

CREATE TABLE IF NOT EXISTS "department_sub" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "department_rels_order_idx" ON "department_rels" ("order");
CREATE INDEX IF NOT EXISTS "department_rels_parent_idx" ON "department_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "department_rels_path_idx" ON "department_rels" ("path");
CREATE UNIQUE INDEX IF NOT EXISTS "department_sub_name_idx" ON "department_sub" ("name");
CREATE INDEX IF NOT EXISTS "department_sub_created_at_idx" ON "department_sub" ("created_at");
ALTER TABLE "department_department_subs" DROP COLUMN IF EXISTS "department_sub";
DO $$ BEGIN
 ALTER TABLE "department_rels" ADD CONSTRAINT "department_rels_parent_id_department_id_fk" FOREIGN KEY ("parent_id") REFERENCES "department"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "department_rels" ADD CONSTRAINT "department_rels_department_sub_id_department_sub_id_fk" FOREIGN KEY ("department_sub_id") REFERENCES "department_sub"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};
