import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

CREATE TABLE IF NOT EXISTS "user_access_access" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"hidden" boolean,
	"read" boolean,
	"create" boolean,
	"update" boolean,
	"admin" boolean
);

CREATE TABLE IF NOT EXISTS "user_access" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "users_rels" ADD COLUMN "user_access_id" integer;
CREATE INDEX IF NOT EXISTS "user_access_access_order_idx" ON "user_access_access" ("_order");
CREATE INDEX IF NOT EXISTS "user_access_access_parent_id_idx" ON "user_access_access" ("_parent_id");
CREATE UNIQUE INDEX IF NOT EXISTS "user_access_access_name_idx" ON "user_access_access" ("name");
CREATE UNIQUE INDEX IF NOT EXISTS "user_access_name_idx" ON "user_access" ("name");
CREATE INDEX IF NOT EXISTS "user_access_created_at_idx" ON "user_access" ("created_at");
DO $$ BEGIN
 ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_user_access_id_user_access_id_fk" FOREIGN KEY ("user_access_id") REFERENCES "user_access"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user_access_access" ADD CONSTRAINT "user_access_access__parent_id_user_access_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "user_access"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "user_access_access";
DROP TABLE "user_access";
ALTER TABLE "users_rels" DROP CONSTRAINT "users_rels_user_access_id_user_access_id_fk";

ALTER TABLE "users_rels" DROP COLUMN IF EXISTS "user_access_id";`);

};
