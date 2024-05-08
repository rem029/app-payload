import { User } from "payload/generated-types";
import { CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../helper/access";

const Departments: CollectionConfig = {
  slug: "department",
  labels: {
    plural: "Departments",
    singular: "Department",
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
      return _isHidden(user as unknown as User, "department");
    },
  },
  timestamps: true,
  fields: [
    { name: "name", label: "Name", type: "text", unique: true },
    {
      name: "department_subs",
      label: "Sub Departments Items",
      type: "array",
      unique: true,
      fields: [
        {
          name: "name",
          label: "Sub Department",
          type: "text",
        },
      ],
    },
  ],
};

export default Departments;
