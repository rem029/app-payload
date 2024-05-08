import payload from "payload";
import { PayloadRequest } from "payload/types";

export const retrieveKeyFromPayload = async (
  keyName: string,
  req: PayloadRequest,
) => {
  const result = await payload.find({
    collection: "variables",
    where: {
      name: {
        equals: keyName,
      },
    },
    req: req as PayloadRequest,
  });

  return result.docs ? result.docs.find((d) => d.name === keyName).value || "" : "";
};

export const retrieveKeysFromPayload = async (
  keyNames: string[],
  req: PayloadRequest,
) => {
  let keys: Record<string, string> = {};

  await Promise.all(
    keyNames.map(async (k) => {
      const value = await retrieveKeyFromPayload(k, req);
      keys = { ...keys, [k]: value };
      return;
    }),
  );

  return keys;
};
