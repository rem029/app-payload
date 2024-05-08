import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "drizzle-orm";

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "_locales" AS ENUM('en', 'ar', 'fr');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_contents_header_language" AS ENUM('en', 'ar', 'fr');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_contents_info_language" AS ENUM('en', 'ar', 'fr');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_employee_questions_item_type" AS ENUM('text', 'checkbox');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_employee_questions_item_language" AS ENUM('en', 'ar', 'fr');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"login_attempts" numeric,
	"lock_until" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "contents_header" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"content" varchar,
	"language" "enum_contents_header_language"
);

CREATE TABLE IF NOT EXISTS "contents_info" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"content" jsonb,
	"language" "enum_contents_info_language"
);

CREATE TABLE IF NOT EXISTS "contents" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "employee_questions_item" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"type" "enum_employee_questions_item_type",
	"language" "enum_employee_questions_item_language",
	"title" varchar,
	"subtitle" varchar
);

CREATE TABLE IF NOT EXISTS "employee_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"default_title" varchar,
	"default_subtitle" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "employee_questions_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"department_id" integer
);

CREATE TABLE IF NOT EXISTS "department" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "department_locales" (
	"name" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "department_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);

CREATE TABLE IF NOT EXISTS "payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer
);

CREATE TABLE IF NOT EXISTS "payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "contents_header_order_idx" ON "contents_header" ("_order");
CREATE INDEX IF NOT EXISTS "contents_header_parent_id_idx" ON "contents_header" ("_parent_id");
CREATE INDEX IF NOT EXISTS "contents_info_order_idx" ON "contents_info" ("_order");
CREATE INDEX IF NOT EXISTS "contents_info_parent_id_idx" ON "contents_info" ("_parent_id");
CREATE INDEX IF NOT EXISTS "contents_created_at_idx" ON "contents" ("created_at");
CREATE INDEX IF NOT EXISTS "employee_questions_item_order_idx" ON "employee_questions_item" ("_order");
CREATE INDEX IF NOT EXISTS "employee_questions_item_parent_id_idx" ON "employee_questions_item" ("_parent_id");
CREATE INDEX IF NOT EXISTS "employee_questions_created_at_idx" ON "employee_questions" ("created_at");
CREATE INDEX IF NOT EXISTS "employee_questions_rels_order_idx" ON "employee_questions_rels" ("order");
CREATE INDEX IF NOT EXISTS "employee_questions_rels_parent_idx" ON "employee_questions_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "employee_questions_rels_path_idx" ON "employee_questions_rels" ("path");
CREATE INDEX IF NOT EXISTS "department_created_at_idx" ON "department" ("created_at");
CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" ("key");
CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" ("created_at");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" ("order");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" ("path");
CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" ("created_at");
DO $$ BEGIN
 ALTER TABLE "contents_header" ADD CONSTRAINT "contents_header__parent_id_contents_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "contents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contents_info" ADD CONSTRAINT "contents_info__parent_id_contents_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "contents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "employee_questions_item" ADD CONSTRAINT "employee_questions_item__parent_id_employee_questions_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "employee_questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "employee_questions_rels" ADD CONSTRAINT "employee_questions_rels_parent_id_employee_questions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "employee_questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "employee_questions_rels" ADD CONSTRAINT "employee_questions_rels_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "department_locales" ADD CONSTRAINT "department_locales__parent_id_department_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "department"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_id_payload_preferences_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_id_users_id_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
	DROP TABLE "users" CASCADE;
	DROP TABLE "contents_header" CASCADE;
	DROP TABLE "contents_info" CASCADE;
	DROP TABLE "contents" CASCADE;
	DROP TABLE "employee_questions_item" CASCADE;
	DROP TABLE "employee_questions" CASCADE;
	DROP TABLE "employee_questions_rels" CASCADE;
	DROP TABLE "department" CASCADE;
	DROP TABLE "department_locales" CASCADE;
	DROP TABLE "payload_preferences" CASCADE;
	DROP TABLE "payload_preferences_rels" CASCADE;
	DROP TABLE "payload_migrations" CASCADE;
`);
}
