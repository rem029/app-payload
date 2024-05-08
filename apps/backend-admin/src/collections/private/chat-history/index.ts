import { User } from "payload/generated-types";
import { CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../../../helper/access";

const ChatHistory: CollectionConfig = {
  slug: "chat-history",
  labels: {
    plural: "Chat histories",
    singular: "Chat history",
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
  timestamps: true,
  fields: [
    { name: "id", label: "Thread ID", type: "text", unique: true, required: true },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      admin: { readOnly: true },
    },
  ],
};

export default ChatHistory;
