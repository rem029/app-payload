import { CollectionConfig, Access } from "payload/types";
import { _getAccess, _isHidden } from "../../../helper/access";
import { User } from "payload/generated-types";

const EmployeeQuestions: CollectionConfig = {
  slug: "employee-questions",
  labels: {
    plural: "Employee Questions",
    singular: "Employee Question",
  },
  access: {
    read: async ({ req }) => await _getAccess(req, "read"),
    create: async ({ req }) => await _getAccess(req, "create"),
    update: async ({ req }) => await _getAccess(req, "update"),
    admin: async ({ req }) => await _getAccess(req, "admin"),
    delete: async ({ req }) => await _getAccess(req, "delete"),
  },
  timestamps: true,
  admin: {
    useAsTitle: "default_title",
    hidden: ({ user }) => {
      return _isHidden(user as unknown as User, "employee-questions");
    },
    group: {
      Survey: "Employee",
    },
  },
  fields: [
    {
      name: "department",
      label: "Department",
      type: "relationship",
      relationTo: "department",
    },
    { name: "default_title", label: "Default Title", type: "text" },
    { name: "default_subtitle", label: "Default Sub-title", type: "text" },
    {
      name: "item",
      label: "Items",
      type: "array",
      fields: [
        {
          name: "type",
          label: "Type",
          type: "select",
          options: [
            { label: "Text", value: "text" },
            { label: "Checkbox", value: "checkbox" },
          ],
          defaultValue: "text",
        },
        {
          name: "language",
          label: "Language",
          type: "select",
          options: [
            { label: "English", value: "en" },
            { label: "Arabic", value: "ar" },
            { label: "French", value: "fr" },
          ],
        },
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Sub-title", type: "text" },
      ],
    },
  ],
};

export default EmployeeQuestions;
