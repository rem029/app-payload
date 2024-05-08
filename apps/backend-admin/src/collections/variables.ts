import { User } from "payload/generated-types";
import { CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../helper/access";

const Variables: CollectionConfig = {
  slug: "variables",
  labels: {
    plural: "Variables",
    singular: "Variable",
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
      return _isHidden(user as unknown as User, "variables");
    },
    group: "Admin",
  },
  timestamps: true,
  fields: [
    { name: "name", label: "Name", type: "text", unique: true, required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "value", label: "Value", type: "text", unique: true },
  ],
};

export default Variables;
