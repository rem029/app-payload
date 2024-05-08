import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const respose = await payload.find({
    collection: "user-access",
    where: {
      name: {
        equals: "Default Access",
      },
    },
  });
  const access = respose.docs[0];
  await payload.update({
    collection: "user-access",
    data: {
      access: [
        ...access.access.map((access) => ({ ...access, delete: true })),
        {
          name: "employee-questions-email-status",
          access: true,
          admin: true,
          create: true,
          delete: true,
          hidden: false,
          read: true,
          update: true,
        },
      ],
    },
    where: {
      id: {
        equals: access.id,
      },
    },
  });
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  const respose = await payload.find({
    collection: "user-access",
    where: {
      name: {
        equals: "Default Access",
      },
    },
  });
  const access = respose.docs[0];
  await payload.update({
    collection: "user-access",
    data: {
      access: access.access.map((access) => ({ ...access, delete: false })),
    },
    where: {
      id: {
        equals: access.id,
      },
    },
  });
}
