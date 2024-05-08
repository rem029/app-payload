import { CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../../helper/access";
import { User } from "payload/generated-types";

const Users: CollectionConfig = {
  slug: "users",
  auth: { useAPIKey: true },
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => {
      return _isHidden(user as unknown as User, "users");
    },
    group: "Admin",
  },
  access: {
    read: async ({ req }) => await _getAccess(req, "read"),
    create: async ({ req }) => await _getAccess(req, "create"),
    update: async ({ req }) => await _getAccess(req, "update"),
    admin: async ({ req }) => await _getAccess(req, "admin"),
    delete: async ({ req }) => await _getAccess(req, "delete"),
  },
  fields: [
    {
      label: "Operator",
      name: "operator",
      type: "relationship",
      relationTo: "operators",
    },
    {
      label: "Role",
      name: "role",
      type: "relationship",
      relationTo: "user-roles",
    },
    {
      label: "Access",
      name: "access",
      type: "relationship",
      relationTo: "user-access",
    },
  ],
};

export default Users;
