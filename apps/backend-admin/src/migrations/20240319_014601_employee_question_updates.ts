import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

CREATE TABLE IF NOT EXISTS "employee_questions_email_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"anonymous_id" varchar,
	"email" varchar,
	"status" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "employee_questions_email_status_anonymous_id_idx" ON "employee_questions_email_status" ("anonymous_id");
CREATE UNIQUE INDEX IF NOT EXISTS "employee_questions_email_status_email_idx" ON "employee_questions_email_status" ("email");
CREATE INDEX IF NOT EXISTS "employee_questions_email_status_created_at_idx" ON "employee_questions_email_status" ("created_at");`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "employee_questions_email_status";`);

};
