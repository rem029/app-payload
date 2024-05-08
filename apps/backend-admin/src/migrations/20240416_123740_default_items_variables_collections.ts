import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "drizzle-orm";

const defaultVariables = [
  "OPEN_AI_KEY",
  "OPEN_AI_ASSISTANT_KEY",
  "OPEN_AI_INSTRUCTION",
  "OPEN_AI_INSTRUCTION_ADDITIONAL",
];

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  for (
    let variableIndex: number = 0;
    variableIndex < defaultVariables.length;
    variableIndex++
  ) {
    await payload.create({
      collection: "variables",
      data: {
        name: defaultVariables[variableIndex],
      },
    });
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  for (
    let variableIndex: number = 0;
    variableIndex < defaultVariables.length;
    variableIndex++
  ) {
    await payload.delete({
      collection: "variables",
      where: {
        name: {
          equals: defaultVariables[variableIndex],
        },
      },
    });
  }
}
