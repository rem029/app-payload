import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_survey_net_promoter_customer_feedback" AS ENUM('detractor', 'neutral', 'promoter');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_survey_customer_feedbacks_visit_frequency" AS ENUM('poor', 'average', 'good', 'very-good', 'excellent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_survey_customer_feedbacks_rating_greeting" AS ENUM('poor', 'average', 'good', 'very-good', 'excellent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_survey_customer_feedbacks_rating_service" AS ENUM('poor', 'average', 'good', 'very-good', 'excellent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_survey_customer_feedbacks_rating_beverage" AS ENUM('poor', 'average', 'good', 'very-good', 'excellent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_survey_customer_feedbacks_rating_food" AS ENUM('poor', 'average', 'good', 'very-good', 'excellent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_survey_customer_feedbacks_rating_value_for_money" AS ENUM('poor', 'average', 'good', 'very-good', 'excellent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_survey_customer_feedbacks_rating_cleanliness" AS ENUM('poor', 'average', 'good', 'very-good', 'excellent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "survey_net_promoter" (
	"id" serial PRIMARY KEY NOT NULL,
	"visit_date" timestamp(3) with time zone,
	"receipt_id" varchar,
	"customer_feedback" "enum_survey_net_promoter_customer_feedback",
	"customer_comments" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "survey_customer_feedbacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"visit_date" timestamp(3) with time zone,
	"receipt_id" varchar,
	"visited_restaurant" varchar,
	"meal_period" varchar,
	"visit_frequency" "enum_survey_customer_feedbacks_visit_frequency",
	"rating_greeting" "enum_survey_customer_feedbacks_rating_greeting",
	"rating_service" "enum_survey_customer_feedbacks_rating_service",
	"rating_beverage" "enum_survey_customer_feedbacks_rating_beverage",
	"rating_food" "enum_survey_customer_feedbacks_rating_food",
	"rating_value_for_money" "enum_survey_customer_feedbacks_rating_value_for_money",
	"rating_cleanliness" "enum_survey_customer_feedbacks_rating_cleanliness",
	"discovery_method" varchar,
	"will_visit_again" varchar,
	"manager_visit" varchar,
	"favorite_restaurant" varchar,
	"additional_comments" varchar,
	"name" varchar,
	"telephone_number" varchar,
	"birth_date" timestamp(3) with time zone,
	"email_address" varchar,
	"marketing_consent" boolean,
	"discovery_text" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "survey_net_promoter_created_at_idx" ON "survey_net_promoter" ("created_at");
CREATE INDEX IF NOT EXISTS "survey_customer_feedbacks_created_at_idx" ON "survey_customer_feedbacks" ("created_at");`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "survey_net_promoter";
DROP TABLE "survey_customer_feedbacks";`);

};
