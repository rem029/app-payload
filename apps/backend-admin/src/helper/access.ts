import { User, UserAccess } from "payload/generated-types";
import { PayloadRequest } from "payload/types";
import { AccessType } from "../types";

export const _getAccess = async (
  req: PayloadRequest<any>,
  type: AccessType,
): Promise<boolean> => {
  const { user, collection } = req;

  if (!user) return false;
  let userAccess: UserAccess;

  if (!user.access) {
    return false;
  }

  userAccess = user.access as UserAccess;
  if (typeof user.access === "number") {
    const response = await req.payload.find({
      collection: "user-access",
      where: {
        id: {
          equals: user.access,
        },
      },
    });

    if (!response.docs) {
      return true;
    }

    userAccess = response.docs[0];
  }

  const currentSlug = collection.config.slug;
  const currentAccess = userAccess.access.find((a) => a.name === currentSlug);
  const hasAccess = currentAccess ? currentAccess[type] : true;

  return hasAccess;
};

export const _isHidden = (user: User, slug: string) => {
  if (!user.access) return true;

  const userAccess = user.access as UserAccess;
  const currentAccess = userAccess.access.find((a) => a.name === slug);

  return currentAccess !== undefined ? currentAccess.hidden : true;
};
