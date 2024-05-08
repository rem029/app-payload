import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  payload.create({
    collection: "user-access",
    data: {
      name: "Default Access",
      access: collectionNames.map((collection) => ({
        name: collection,
        ...defaultAccess,
      })),
    },
  });
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.delete({
    collection: "user-access",
    where: {
      name: {
        equals: "Default Access",
      },
    },
  });
}

const defaultAccess = {
  read: true,
  admin: true,
  create: true,
  hidden: false,
  update: true,
};

const collectionNames = [
  "employee-benefits",
  "employee-benefits-category",
  "employee-questions",
  "employee-responses",
  "news-letters-reviews",
  "news-letter",
  "survey-customer-feedbacks",
  "survey-net-promoter",
  "contents",
  "department",
  "media",
  "operators",
  "user-access",
  "user-roles",
  "users",
];
