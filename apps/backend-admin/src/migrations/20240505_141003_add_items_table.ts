import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

CREATE TABLE IF NOT EXISTS "chat_search_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"parsed_text" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "chat_search_files_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "items_items_values" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "items_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "chat_search_files_name_idx" ON "chat_search_files" ("name");
CREATE INDEX IF NOT EXISTS "chat_search_files_created_at_idx" ON "chat_search_files" ("created_at");
CREATE INDEX IF NOT EXISTS "chat_search_files_rels_order_idx" ON "chat_search_files_rels" ("order");
CREATE INDEX IF NOT EXISTS "chat_search_files_rels_parent_idx" ON "chat_search_files_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "chat_search_files_rels_path_idx" ON "chat_search_files_rels" ("path");
CREATE INDEX IF NOT EXISTS "items_items_values_order_idx" ON "items_items_values" ("_order");
CREATE INDEX IF NOT EXISTS "items_items_values_parent_id_idx" ON "items_items_values" ("_parent_id");
CREATE INDEX IF NOT EXISTS "items_items_order_idx" ON "items_items" ("_order");
CREATE INDEX IF NOT EXISTS "items_items_parent_id_idx" ON "items_items" ("_parent_id");
CREATE UNIQUE INDEX IF NOT EXISTS "items_name_idx" ON "items" ("name");
CREATE INDEX IF NOT EXISTS "items_created_at_idx" ON "items" ("created_at");
DO $$ BEGIN
 ALTER TABLE "chat_search_files_rels" ADD CONSTRAINT "chat_search_files_rels_parent_id_chat_search_files_id_fk" FOREIGN KEY ("parent_id") REFERENCES "chat_search_files"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "chat_search_files_rels" ADD CONSTRAINT "chat_search_files_rels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "items_items_values" ADD CONSTRAINT "items_items_values__parent_id_items_items_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "items_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "items_items" ADD CONSTRAINT "items_items__parent_id_items_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "chat_search_files";
DROP TABLE "chat_search_files_rels";
DROP TABLE "items_items_values";
DROP TABLE "items_items";
DROP TABLE "items";`);

};
