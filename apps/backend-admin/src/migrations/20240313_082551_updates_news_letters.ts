import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_news_letters_reviews_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__news_letters_reviews_v_version_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "news_letters_reviews_comments" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"comment" varchar,
	"user" varchar
);

CREATE TABLE IF NOT EXISTS "news_letters_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"description" varchar,
	"post_date" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_news_letters_reviews_status"
);

CREATE TABLE IF NOT EXISTS "news_letters_reviews_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"operators_id" integer,
	"news_letter_id" integer
);

CREATE TABLE IF NOT EXISTS "_news_letters_reviews_v_version_comments" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"comment" varchar,
	"user" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_news_letters_reviews_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_title" varchar,
	"version_description" varchar,
	"version_post_date" timestamp(3) with time zone,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__news_letters_reviews_v_version_status",
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
);

CREATE TABLE IF NOT EXISTS "_news_letters_reviews_v_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"news_letters_reviews_id" integer,
	"operators_id" integer,
	"news_letter_id" integer
);

CREATE TABLE IF NOT EXISTS "users_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"operators_id" integer,
	"user_roles_id" integer
);

CREATE TABLE IF NOT EXISTS "user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "operators" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "news_letter_rels" DROP CONSTRAINT "news_letter_rels_department_id_department_id_fk";

CREATE INDEX IF NOT EXISTS "news_letters_reviews_comments_order_idx" ON "news_letters_reviews_comments" ("_order");
CREATE INDEX IF NOT EXISTS "news_letters_reviews_comments_parent_id_idx" ON "news_letters_reviews_comments" ("_parent_id");
CREATE INDEX IF NOT EXISTS "news_letters_reviews_created_at_idx" ON "news_letters_reviews" ("created_at");
CREATE INDEX IF NOT EXISTS "news_letters_reviews_rels_order_idx" ON "news_letters_reviews_rels" ("order");
CREATE INDEX IF NOT EXISTS "news_letters_reviews_rels_parent_idx" ON "news_letters_reviews_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "news_letters_reviews_rels_path_idx" ON "news_letters_reviews_rels" ("path");
CREATE INDEX IF NOT EXISTS "_news_letters_reviews_v_version_comments_order_idx" ON "_news_letters_reviews_v_version_comments" ("_order");
CREATE INDEX IF NOT EXISTS "_news_letters_reviews_v_version_comments_parent_id_idx" ON "_news_letters_reviews_v_version_comments" ("_parent_id");
CREATE INDEX IF NOT EXISTS "_news_letters_reviews_v_version_version_created_at_idx" ON "_news_letters_reviews_v" ("version_created_at");
CREATE INDEX IF NOT EXISTS "_news_letters_reviews_v_created_at_idx" ON "_news_letters_reviews_v" ("created_at");
CREATE INDEX IF NOT EXISTS "_news_letters_reviews_v_updated_at_idx" ON "_news_letters_reviews_v" ("updated_at");
CREATE INDEX IF NOT EXISTS "_news_letters_reviews_v_latest_idx" ON "_news_letters_reviews_v" ("latest");
CREATE INDEX IF NOT EXISTS "_news_letters_reviews_v_rels_order_idx" ON "_news_letters_reviews_v_rels" ("order");
CREATE INDEX IF NOT EXISTS "_news_letters_reviews_v_rels_parent_idx" ON "_news_letters_reviews_v_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "_news_letters_reviews_v_rels_path_idx" ON "_news_letters_reviews_v_rels" ("path");
CREATE INDEX IF NOT EXISTS "users_rels_order_idx" ON "users_rels" ("order");
CREATE INDEX IF NOT EXISTS "users_rels_parent_idx" ON "users_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "users_rels_path_idx" ON "users_rels" ("path");
CREATE UNIQUE INDEX IF NOT EXISTS "user_roles_name_idx" ON "user_roles" ("name");
CREATE INDEX IF NOT EXISTS "user_roles_created_at_idx" ON "user_roles" ("created_at");
CREATE INDEX IF NOT EXISTS "operators_created_at_idx" ON "operators" ("created_at");
ALTER TABLE "news_letter" DROP COLUMN IF EXISTS "post_date";
ALTER TABLE "news_letter_rels" DROP COLUMN IF EXISTS "department_id";
DO $$ BEGIN
 ALTER TABLE "news_letters_reviews_comments" ADD CONSTRAINT "news_letters_reviews_comments__parent_id_news_letters_reviews_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "news_letters_reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "news_letters_reviews_rels" ADD CONSTRAINT "news_letters_reviews_rels_parent_id_news_letters_reviews_id_fk" FOREIGN KEY ("parent_id") REFERENCES "news_letters_reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "news_letters_reviews_rels" ADD CONSTRAINT "news_letters_reviews_rels_operators_id_operators_id_fk" FOREIGN KEY ("operators_id") REFERENCES "operators"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "news_letters_reviews_rels" ADD CONSTRAINT "news_letters_reviews_rels_news_letter_id_news_letter_id_fk" FOREIGN KEY ("news_letter_id") REFERENCES "news_letter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_news_letters_reviews_v_version_comments" ADD CONSTRAINT "_news_letters_reviews_v_version_comments__parent_id__news_letters_reviews_v_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_news_letters_reviews_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_news_letters_reviews_v_rels" ADD CONSTRAINT "_news_letters_reviews_v_rels_parent_id__news_letters_reviews_v_id_fk" FOREIGN KEY ("parent_id") REFERENCES "_news_letters_reviews_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_news_letters_reviews_v_rels" ADD CONSTRAINT "_news_letters_reviews_v_rels_news_letters_reviews_id_news_letters_reviews_id_fk" FOREIGN KEY ("news_letters_reviews_id") REFERENCES "news_letters_reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_news_letters_reviews_v_rels" ADD CONSTRAINT "_news_letters_reviews_v_rels_operators_id_operators_id_fk" FOREIGN KEY ("operators_id") REFERENCES "operators"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_news_letters_reviews_v_rels" ADD CONSTRAINT "_news_letters_reviews_v_rels_news_letter_id_news_letter_id_fk" FOREIGN KEY ("news_letter_id") REFERENCES "news_letter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_id_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_operators_id_operators_id_fk" FOREIGN KEY ("operators_id") REFERENCES "operators"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "user_roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "news_letters_reviews_comments";
DROP TABLE "news_letters_reviews";
DROP TABLE "news_letters_reviews_rels";
DROP TABLE "_news_letters_reviews_v_version_comments";
DROP TABLE "_news_letters_reviews_v";
DROP TABLE "_news_letters_reviews_v_rels";
DROP TABLE "users_rels";
DROP TABLE "user_roles";
DROP TABLE "operators";
ALTER TABLE "news_letter" ADD COLUMN "post_date" timestamp(3) with time zone;
ALTER TABLE "news_letter_rels" ADD COLUMN "department_id" integer;
DO $$ BEGIN
 ALTER TABLE "news_letter_rels" ADD CONSTRAINT "news_letter_rels_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};
