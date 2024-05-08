import { CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../../../helper/access";
import { User } from "payload/generated-types";

const UserRoles: CollectionConfig = {
  slug: "user-roles",
  labels: {
    plural: "Roles",
    singular: "Role",
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
      return _isHidden(user as unknown as User, "user-roles");
    },
    group: "Admin",
  },
  timestamps: true,
  fields: [{ name: "name", label: "Name", type: "text", unique: true }],
};

export default UserRoles;
