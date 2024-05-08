import { User } from "payload/generated-types";
import { CollectionConfig, Access } from "payload/types";
import { _getAccess, _isHidden } from "../helper/access";

const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticURL: "/payload/media/",
    staticDir: "media",
    adminThumbnail: ({ doc }) => `${doc.filename}`,
  },
  access: {
    // read: async ({ req }) => await _getAccess(req, "read"),
    read: () => true,
    create: async ({ req }) => await _getAccess(req, "create"),
    update: async ({ req }) => await _getAccess(req, "update"),
    admin: async ({ req }) => await _getAccess(req, "admin"),
    delete: async ({ req }) => await _getAccess(req, "delete"),
  },
  admin: {
    hidden: ({ user }) => {
      return _isHidden(user as unknown as User, "media");
    },
  },
  timestamps: true,
  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
};

export default Media;
