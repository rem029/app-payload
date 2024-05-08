import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

CREATE TABLE IF NOT EXISTS "department_department_subs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL
);

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

DROP TABLE "department_locales";
ALTER TABLE "department" ADD COLUMN "name" varchar;
CREATE INDEX IF NOT EXISTS "department_department_subs_order_idx" ON "department_department_subs" ("_order");
CREATE INDEX IF NOT EXISTS "department_department_subs_parent_id_idx" ON "department_department_subs" ("_parent_id");
CREATE INDEX IF NOT EXISTS "department_rels_order_idx" ON "department_rels" ("order");
CREATE INDEX IF NOT EXISTS "department_rels_parent_idx" ON "department_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "department_rels_path_idx" ON "department_rels" ("path");
CREATE UNIQUE INDEX IF NOT EXISTS "department_sub_name_idx" ON "department_sub" ("name");
CREATE INDEX IF NOT EXISTS "department_sub_created_at_idx" ON "department_sub" ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "department_name_idx" ON "department" ("name");
DO $$ BEGIN
 ALTER TABLE "department_department_subs" ADD CONSTRAINT "department_department_subs__parent_id_department_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "department"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

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

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

CREATE TABLE IF NOT EXISTS "department_locales" (
	"name" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "department_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);

DROP TABLE "department_department_subs";
DROP TABLE "department_rels";
DROP TABLE "department_sub";
DROP INDEX IF EXISTS "department_name_idx";
ALTER TABLE "department" DROP COLUMN IF EXISTS "name";
DO $$ BEGIN
 ALTER TABLE "department_locales" ADD CONSTRAINT "department_locales__parent_id_department_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "department"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};
