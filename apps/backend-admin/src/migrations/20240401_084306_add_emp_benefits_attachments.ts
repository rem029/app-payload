import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_employee_banner_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__employee_banner_v_version_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "employee_banner" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"link" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_employee_banner_status"
);

CREATE TABLE IF NOT EXISTS "employee_banner_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "_employee_banner_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_name" varchar,
	"version_link" varchar,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__employee_banner_v_version_status",
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
);

CREATE TABLE IF NOT EXISTS "_employee_banner_v_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"employee_banner_id" integer,
	"media_id" integer
);

CREATE UNIQUE INDEX IF NOT EXISTS "employee_banner_name_idx" ON "employee_banner" ("name");
CREATE INDEX IF NOT EXISTS "employee_banner_created_at_idx" ON "employee_banner" ("created_at");
CREATE INDEX IF NOT EXISTS "employee_banner_rels_order_idx" ON "employee_banner_rels" ("order");
CREATE INDEX IF NOT EXISTS "employee_banner_rels_parent_idx" ON "employee_banner_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "employee_banner_rels_path_idx" ON "employee_banner_rels" ("path");
CREATE INDEX IF NOT EXISTS "_employee_banner_v_version_version_name_idx" ON "_employee_banner_v" ("version_name");
CREATE INDEX IF NOT EXISTS "_employee_banner_v_version_version_created_at_idx" ON "_employee_banner_v" ("version_created_at");
CREATE INDEX IF NOT EXISTS "_employee_banner_v_created_at_idx" ON "_employee_banner_v" ("created_at");
CREATE INDEX IF NOT EXISTS "_employee_banner_v_updated_at_idx" ON "_employee_banner_v" ("updated_at");
CREATE INDEX IF NOT EXISTS "_employee_banner_v_latest_idx" ON "_employee_banner_v" ("latest");
CREATE INDEX IF NOT EXISTS "_employee_banner_v_rels_order_idx" ON "_employee_banner_v_rels" ("order");
CREATE INDEX IF NOT EXISTS "_employee_banner_v_rels_parent_idx" ON "_employee_banner_v_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "_employee_banner_v_rels_path_idx" ON "_employee_banner_v_rels" ("path");
DO $$ BEGIN
 ALTER TABLE "employee_banner_rels" ADD CONSTRAINT "employee_banner_rels_parent_id_employee_banner_id_fk" FOREIGN KEY ("parent_id") REFERENCES "employee_banner"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "employee_banner_rels" ADD CONSTRAINT "employee_banner_rels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_employee_banner_v_rels" ADD CONSTRAINT "_employee_banner_v_rels_parent_id__employee_banner_v_id_fk" FOREIGN KEY ("parent_id") REFERENCES "_employee_banner_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_employee_banner_v_rels" ADD CONSTRAINT "_employee_banner_v_rels_employee_banner_id_employee_banner_id_fk" FOREIGN KEY ("employee_banner_id") REFERENCES "employee_banner"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_employee_banner_v_rels" ADD CONSTRAINT "_employee_banner_v_rels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "employee_banner";
DROP TABLE "employee_banner_rels";
DROP TABLE "_employee_banner_v";
DROP TABLE "_employee_banner_v_rels";`);

};
