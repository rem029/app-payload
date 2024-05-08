import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_employee_benefits_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__employee_benefits_v_version_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "employee_benefits_benefits" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"description" varchar
);

CREATE TABLE IF NOT EXISTS "employee_benefits" (
	"id" serial PRIMARY KEY NOT NULL,
	"general_info_name" varchar,
	"contact_info_phone" varchar,
	"contact_info_email" varchar,
	"contact_info_point_of_contact" varchar,
	"contact_info_address" varchar,
	"expiry_date" timestamp(3) with time zone,
	"external_link" varchar,
	"terms_and_condition" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_employee_benefits_status"
);

CREATE TABLE IF NOT EXISTS "employee_benefits_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"employee_benefits_category_id" integer,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "_employee_benefits_v_version_benefits" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"description" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_employee_benefits_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_general_info_name" varchar,
	"version_contact_info_phone" varchar,
	"version_contact_info_email" varchar,
	"version_contact_info_point_of_contact" varchar,
	"version_contact_info_address" varchar,
	"version_expiry_date" timestamp(3) with time zone,
	"version_external_link" varchar,
	"version_terms_and_condition" jsonb,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__employee_benefits_v_version_status",
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
);

CREATE TABLE IF NOT EXISTS "_employee_benefits_v_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"employee_benefits_id" integer,
	"employee_benefits_category_id" integer,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "employee_benefits_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "employee_benefits_benefits_order_idx" ON "employee_benefits_benefits" ("_order");
CREATE INDEX IF NOT EXISTS "employee_benefits_benefits_parent_id_idx" ON "employee_benefits_benefits" ("_parent_id");
CREATE INDEX IF NOT EXISTS "employee_benefits_created_at_idx" ON "employee_benefits" ("created_at");
CREATE INDEX IF NOT EXISTS "employee_benefits_rels_order_idx" ON "employee_benefits_rels" ("order");
CREATE INDEX IF NOT EXISTS "employee_benefits_rels_parent_idx" ON "employee_benefits_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "employee_benefits_rels_path_idx" ON "employee_benefits_rels" ("path");
CREATE INDEX IF NOT EXISTS "_employee_benefits_v_version_benefits_order_idx" ON "_employee_benefits_v_version_benefits" ("_order");
CREATE INDEX IF NOT EXISTS "_employee_benefits_v_version_benefits_parent_id_idx" ON "_employee_benefits_v_version_benefits" ("_parent_id");
CREATE INDEX IF NOT EXISTS "_employee_benefits_v_version_version_created_at_idx" ON "_employee_benefits_v" ("version_created_at");
CREATE INDEX IF NOT EXISTS "_employee_benefits_v_created_at_idx" ON "_employee_benefits_v" ("created_at");
CREATE INDEX IF NOT EXISTS "_employee_benefits_v_updated_at_idx" ON "_employee_benefits_v" ("updated_at");
CREATE INDEX IF NOT EXISTS "_employee_benefits_v_latest_idx" ON "_employee_benefits_v" ("latest");
CREATE INDEX IF NOT EXISTS "_employee_benefits_v_rels_order_idx" ON "_employee_benefits_v_rels" ("order");
CREATE INDEX IF NOT EXISTS "_employee_benefits_v_rels_parent_idx" ON "_employee_benefits_v_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "_employee_benefits_v_rels_path_idx" ON "_employee_benefits_v_rels" ("path");
CREATE INDEX IF NOT EXISTS "employee_benefits_category_created_at_idx" ON "employee_benefits_category" ("created_at");
DO $$ BEGIN
 ALTER TABLE "employee_benefits_benefits" ADD CONSTRAINT "employee_benefits_benefits__parent_id_employee_benefits_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "employee_benefits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "employee_benefits_rels" ADD CONSTRAINT "employee_benefits_rels_parent_id_employee_benefits_id_fk" FOREIGN KEY ("parent_id") REFERENCES "employee_benefits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "employee_benefits_rels" ADD CONSTRAINT "employee_benefits_rels_employee_benefits_category_id_employee_benefits_category_id_fk" FOREIGN KEY ("employee_benefits_category_id") REFERENCES "employee_benefits_category"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "employee_benefits_rels" ADD CONSTRAINT "employee_benefits_rels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_employee_benefits_v_version_benefits" ADD CONSTRAINT "_employee_benefits_v_version_benefits__parent_id__employee_benefits_v_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_employee_benefits_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_employee_benefits_v_rels" ADD CONSTRAINT "_employee_benefits_v_rels_parent_id__employee_benefits_v_id_fk" FOREIGN KEY ("parent_id") REFERENCES "_employee_benefits_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_employee_benefits_v_rels" ADD CONSTRAINT "_employee_benefits_v_rels_employee_benefits_id_employee_benefits_id_fk" FOREIGN KEY ("employee_benefits_id") REFERENCES "employee_benefits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_employee_benefits_v_rels" ADD CONSTRAINT "_employee_benefits_v_rels_employee_benefits_category_id_employee_benefits_category_id_fk" FOREIGN KEY ("employee_benefits_category_id") REFERENCES "employee_benefits_category"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_employee_benefits_v_rels" ADD CONSTRAINT "_employee_benefits_v_rels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "employee_benefits_benefits";
DROP TABLE "employee_benefits";
DROP TABLE "employee_benefits_rels";
DROP TABLE "_employee_benefits_v_version_benefits";
DROP TABLE "_employee_benefits_v";
DROP TABLE "_employee_benefits_v_rels";
DROP TABLE "employee_benefits_category";`);

};
