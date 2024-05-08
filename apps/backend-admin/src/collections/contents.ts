import { User } from "payload/generated-types";
import { CollectionConfig, Access } from "payload/types";
import { _getAccess, _isHidden } from "../helper/access";

const Contents: CollectionConfig = {
  slug: "contents",
  access: {
    read: async ({ req }) => await _getAccess(req, "read"),
    create: async ({ req }) => await _getAccess(req, "create"),
    update: async ({ req }) => await _getAccess(req, "update"),
    admin: async ({ req }) => await _getAccess(req, "admin"),
    delete: async ({ req }) => await _getAccess(req, "delete"),
  },
  admin: {
    hidden: ({ user }) => {
      return _isHidden(user as unknown as User, "contents");
    },
  },
  timestamps: true,
  fields: [
    {
      name: "header",
      label: "Header",
      type: "array",
      fields: [
        { name: "content", label: "Content", type: "text" },
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
      ],
    },
    {
      name: "info",
      label: "Info",
      type: "array",
      fields: [
        { name: "content", label: "Content", type: "richText" },
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
      ],
    },
  ],
};

export default Contents;
