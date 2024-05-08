import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TYPE "enum_employee_responses_questions_response" ADD VALUE 'strongly-disagree';
ALTER TYPE "enum_employee_responses_questions_response" ADD VALUE 'disagree';
ALTER TYPE "enum_employee_responses_questions_response" ADD VALUE 'i-do-not-know';
ALTER TYPE "enum_employee_responses_questions_response" ADD VALUE 'agree';
ALTER TYPE "enum_employee_responses_questions_response" ADD VALUE 'strongly-agree';`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TYPE "enum_employee_responses_questions_response" ADD VALUE 'very-low';
ALTER TYPE "enum_employee_responses_questions_response" ADD VALUE 'low';
ALTER TYPE "enum_employee_responses_questions_response" ADD VALUE 'neutral';
ALTER TYPE "enum_employee_responses_questions_response" ADD VALUE 'high';
ALTER TYPE "enum_employee_responses_questions_response" ADD VALUE 'very-high';`);

};
