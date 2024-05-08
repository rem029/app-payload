import { BeforeDuplicate, CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../../../helper/access";
import { User, UserAccess } from "payload/generated-types";
import payloadConfig from "../../../payload.config";

const beforeDuplicate: BeforeDuplicate<UserAccess> = ({ data }) => {
  return {
    ...data,
    name: `${data.name} Copy`,
  };
};

const UserAccess: CollectionConfig = {
  slug: "user-access",
  labels: {
    plural: "Access",
    singular: "Access",
  },
  access: {
    read: async ({ req }) => await _getAccess(req, "read"),
    create: async ({ req }) => await _getAccess(req, "create"),
    update: async ({ req }) => await _getAccess(req, "update"),
    admin: async ({ req }) => await _getAccess(req, "admin"),
    delete: async ({ req }) => await _getAccess(req, "delete"),
  },
  admin: {
    useAsTitle: "name",
    hidden: ({ user }) => {
      return _isHidden(user as unknown as User, "user-access");
    },
    group: "Admin",
    hooks: { beforeDuplicate },
  },
  timestamps: true,
  fields: [
    { name: "name", label: "Name", type: "text", unique: true },
    {
      type: "array",
      name: "access",
      label: "Access",
      defaultValue: async () => {
        try {
          const response = (await payloadConfig).collections.map((c) => ({
            name: c.slug,
          }));

          return response;
        } catch {
          return undefined;
        }
      },
      fields: [
        { name: "name", label: "Collection name", type: "text" },
        {
          type: "row",
          fields: [
            { type: "checkbox", name: "hidden" },
            { type: "checkbox", name: "read" },
            { type: "checkbox", name: "create" },
            { type: "checkbox", name: "update" },
            { type: "checkbox", name: "admin" },
            { type: "checkbox", name: "delete" },
            { type: "checkbox", name: "access", label: "API Access" },
          ],
        },
      ],
    },
  ],
};

export default UserAccess;
