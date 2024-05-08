import { HealthCheck, User } from "payload/generated-types";
import { BeforeDuplicate, CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../helper/access";

const beforeDuplicate: BeforeDuplicate<HealthCheck> = ({ data }) => {
  return {
    ...data,
    name: `${data.name} Copy`,
  };
};

const HealthCheck: CollectionConfig = {
  slug: "health-check",
  labels: {
    plural: "Health Checks",
    singular: "Health Check",
  },
  access: {
    read: async ({ req }) => await _getAccess(req, "read"),
    create: async ({ req }) => await _getAccess(req, "create"),
    update: async ({ req }) => await _getAccess(req, "update"),
    admin: async ({ req }) => await _getAccess(req, "admin"),
    delete: async ({ req }) => await _getAccess(req, "delete"),
  },
  admin: {
    useAsTitle: "url",
    hidden: ({ user }) => {
      return _isHidden(user as unknown as User, "health-check");
    },
    hooks: { beforeDuplicate: beforeDuplicate },
    group: "Admin",
  },
  timestamps: true,
  fields: [
    { name: "name", label: "Name", type: "text", required: false },
    { name: "url", label: "URL", type: "text", unique: true, required: true },
  ],
};

export default HealthCheck;
