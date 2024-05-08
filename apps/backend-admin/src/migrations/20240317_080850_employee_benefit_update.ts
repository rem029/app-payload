import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "drizzle-orm";

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  for (let cIndex = 0; cIndex < benfitsCategories.length; cIndex++) {
    const query = sql.raw(
      `INSERT INTO employee_benefits_category(name) VALUES('${benfitsCategories[cIndex]}') RETURNING id;`,
    );

    await payload.db.drizzle.execute(query);
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  for (let cIndex = 0; cIndex < benfitsCategories.length; cIndex++) {
    const query = sql.raw(
      `DELETE FROM employee_benefits_category WHERE name = '${benfitsCategories[cIndex]}'`,
    );

    await payload.db.drizzle.execute(query);
  }
}

const benfitsCategories = [
  "Medical",
  "Laundry",
  "Hotel",
  "Restaurant",
  "Service",
  "Activity",
];
