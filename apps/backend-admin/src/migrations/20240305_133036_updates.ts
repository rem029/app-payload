import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_employee_responses_questions_response" AS ENUM('very-low', 'low', 'neutral', 'high', 'very-high');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TYPE "enum_survey_customer_feedbacks_visit_frequency" ADD VALUE 'daily';
ALTER TYPE "enum_survey_customer_feedbacks_visit_frequency" ADD VALUE 'weekly';
ALTER TYPE "enum_survey_customer_feedbacks_visit_frequency" ADD VALUE 'monthly';
ALTER TYPE "enum_survey_customer_feedbacks_visit_frequency" ADD VALUE 'first-time';
CREATE TABLE IF NOT EXISTS "employee_responses_questions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"response" "enum_employee_responses_questions_response" NOT NULL
);

CREATE TABLE IF NOT EXISTS "employee_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"anonymous_id" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "employee_responses_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"employee_questions_id" integer
);

CREATE INDEX IF NOT EXISTS "employee_responses_questions_order_idx" ON "employee_responses_questions" ("_order");
CREATE INDEX IF NOT EXISTS "employee_responses_questions_parent_id_idx" ON "employee_responses_questions" ("_parent_id");
CREATE UNIQUE INDEX IF NOT EXISTS "employee_responses_anonymous_id_idx" ON "employee_responses" ("anonymous_id");
CREATE INDEX IF NOT EXISTS "employee_responses_created_at_idx" ON "employee_responses" ("created_at");
CREATE INDEX IF NOT EXISTS "employee_responses_rels_order_idx" ON "employee_responses_rels" ("order");
CREATE INDEX IF NOT EXISTS "employee_responses_rels_parent_idx" ON "employee_responses_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "employee_responses_rels_path_idx" ON "employee_responses_rels" ("path");
DO $$ BEGIN
 ALTER TABLE "employee_responses_questions" ADD CONSTRAINT "employee_responses_questions__parent_id_employee_responses_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "employee_responses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "employee_responses_rels" ADD CONSTRAINT "employee_responses_rels_parent_id_employee_responses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "employee_responses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "employee_responses_rels" ADD CONSTRAINT "employee_responses_rels_employee_questions_id_employee_questions_id_fk" FOREIGN KEY ("employee_questions_id") REFERENCES "employee_questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TYPE "enum_survey_customer_feedbacks_visit_frequency" ADD VALUE 'poor';
ALTER TYPE "enum_survey_customer_feedbacks_visit_frequency" ADD VALUE 'average';
ALTER TYPE "enum_survey_customer_feedbacks_visit_frequency" ADD VALUE 'good';
ALTER TYPE "enum_survey_customer_feedbacks_visit_frequency" ADD VALUE 'very-good';
ALTER TYPE "enum_survey_customer_feedbacks_visit_frequency" ADD VALUE 'excellent';
DROP TABLE "employee_responses_questions";
DROP TABLE "employee_responses";
DROP TABLE "employee_responses_rels";`);

};
