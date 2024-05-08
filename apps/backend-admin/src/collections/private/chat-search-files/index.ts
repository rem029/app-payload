import { User } from "payload/generated-types";
import { CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../../../helper/access";
import { beforeChangeChatSearchFilesHook } from "../../hooks";

const ChatSearchFiles: CollectionConfig = {
  slug: "chat-search-files",
  labels: {
    plural: "Chat Search Files",
    singular: "Chat Search File",
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
      return _isHidden(user as unknown as User, "chat-history");
    },
    group: "Chat",
  },
  hooks: { beforeChange: [beforeChangeChatSearchFilesHook] },

  timestamps: true,
  fields: [
    { name: "name", label: "Name", type: "text", unique: true, required: true },
    {
      name: "media",
      label: "File",
      type: "relationship",
      relationTo: "media",
      required: true,
    },
    {
      name: "parsed_text",
      label: "Parsed Text",
      type: "textarea",
      admin: { readOnly: true },
      maxLength: 2000000,
    },
  ],
};

export default ChatSearchFiles;
