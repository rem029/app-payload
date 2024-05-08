import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const responseCreateUserAccess = await payload.create({
    collection: "user-access",
    data: {
      name: "Default Access",
      access: collectionNames.map((collection) => ({
        name: collection,
        ...defaultAccess,
      })),
    },
  });

  await payload.create({
    collection: "users",
    data: {
      email: "default@payload.com",
      password: "default@payload.com",
      access: responseCreateUserAccess.id,
    },
  });
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.delete({
    collection: "users",
    where: {
      email: {
        equals: "default@payload.com",
      },
    },
  });

  await payload.delete({
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
  access: true,
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
