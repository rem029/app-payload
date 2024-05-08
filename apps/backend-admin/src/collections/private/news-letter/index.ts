import { User } from "payload/generated-types";
import { CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../../../helper/access";

const NewsLetters: CollectionConfig = {
  slug: "news-letter",
  labels: {
    plural: "News letters",
    singular: "News letter",
  },
  access: {
    read: async ({ req }) => await _getAccess(req, "read"),
    create: async ({ req }) => await _getAccess(req, "create"),
    update: async ({ req }) => await _getAccess(req, "update"),
    admin: async ({ req }) => await _getAccess(req, "admin"),
    delete: async ({ req }) => await _getAccess(req, "delete"),
  },
  admin: {
    useAsTitle: "title",
    hidden: ({ user }) => {
      return _isHidden(user as unknown as User, "news-letter");
    },
  },
  timestamps: true,
  fields: [
    { name: "media", label: "Media", relationTo: "media", type: "upload" },
    { name: "title", label: "Title", type: "text" },
    { name: "content", label: "Content", type: "richText" },
  ],
};

export default NewsLetters;
