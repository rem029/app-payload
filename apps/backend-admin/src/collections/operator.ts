import { User } from "payload/generated-types";
import { CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../helper/access";

const Operators: CollectionConfig = {
  slug: "operators",
  labels: {
    plural: "Operators",
    singular: "Operator",
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
      return _isHidden(user as unknown as User, "operators");
    },
  },
  timestamps: true,
  fields: [{ name: "name", label: "Name", type: "text" }],
};

export default Operators;
