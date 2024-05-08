import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

CREATE TABLE IF NOT EXISTS "ifly_waiver_forms_dependents" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"qid" varchar NOT NULL,
	"phone" varchar
);

CREATE TABLE IF NOT EXISTS "ifly_waiver_forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"qid" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"signature_svg" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "ifly_waiver_forms_dependents_order_idx" ON "ifly_waiver_forms_dependents" ("_order");
CREATE INDEX IF NOT EXISTS "ifly_waiver_forms_dependents_parent_id_idx" ON "ifly_waiver_forms_dependents" ("_parent_id");
CREATE INDEX IF NOT EXISTS "ifly_waiver_forms_dependents_name_idx" ON "ifly_waiver_forms_dependents" ("name");
CREATE INDEX IF NOT EXISTS "ifly_waiver_forms_dependents_qid_idx" ON "ifly_waiver_forms_dependents" ("qid");
CREATE INDEX IF NOT EXISTS "ifly_waiver_forms_dependents_phone_idx" ON "ifly_waiver_forms_dependents" ("phone");
CREATE INDEX IF NOT EXISTS "ifly_waiver_forms_name_idx" ON "ifly_waiver_forms" ("name");
CREATE INDEX IF NOT EXISTS "ifly_waiver_forms_qid_idx" ON "ifly_waiver_forms" ("qid");
CREATE INDEX IF NOT EXISTS "ifly_waiver_forms_phone_idx" ON "ifly_waiver_forms" ("phone");
CREATE INDEX IF NOT EXISTS "ifly_waiver_forms_created_at_idx" ON "ifly_waiver_forms" ("created_at");
DO $$ BEGIN
 ALTER TABLE "ifly_waiver_forms_dependents" ADD CONSTRAINT "ifly_waiver_forms_dependents__parent_id_ifly_waiver_forms_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "ifly_waiver_forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "ifly_waiver_forms_dependents";
DROP TABLE "ifly_waiver_forms";`);

};
