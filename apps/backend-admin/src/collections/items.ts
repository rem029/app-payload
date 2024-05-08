import { Item, User } from "payload/generated-types";
import { BeforeDuplicate, CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../helper/access";

export const beforeDuplicate: BeforeDuplicate<Item> = ({ data }) => {
  return {
    ...data,
    name: `${data.name} Copy`,
  };
};

const Items: CollectionConfig = {
  slug: "items",
  labels: {
    plural: "Items",
    singular: "item",
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
      return _isHidden(user as unknown as User, "items");
    },
    hooks: { beforeDuplicate: beforeDuplicate },
  },
  timestamps: true,
  fields: [
    { name: "name", label: "Name", type: "text", unique: true, required: true },
    { name: "description", label: "Description", type: "textarea" },
    {
      name: "items",
      label: "Items",
      type: "array",
      fields: [
        {
          name: "values",
          label: "Values",
          type: "array",
          fields: [
            { name: "key", label: "Key", type: "text", required: true },
            { name: "value", label: "Value", type: "textarea" },
          ],
        },
      ],
    },
  ],
};

export default Items;
