import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "drizzle-orm";

const roles = ["Admin", "User", "Reviewer"];
const operators = ["Banyan Tree", "Doha Oasis", "Doha Quest", "Printemps", "VOX"];

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  for (let rIndex = 0; rIndex < roles.length; rIndex++) {
    const item = roles[rIndex];

    const query = sql.raw(`
            INSERT INTO user_roles(id, name)
            VALUES(${rIndex + 1}, '${item}') ON CONFLICT DO NOTHING;`);

    await payload.db.drizzle.execute(query);
  }

  for (let oIndex = 0; oIndex < operators.length; oIndex++) {
    const item = operators[oIndex];

    const query = sql.raw(`
            INSERT INTO operators(id, name)
            VALUES(${oIndex + 1}, '${item}') ON CONFLICT DO NOTHING;`);

    await payload.db.drizzle.execute(query);
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.db.drizzle.execute(sql`
    DELETE FROM user_roles CASCADE;
`);

  payload.db.drizzle.execute(sql`
DELETE FROM operators CASCADE;
`);
}
