import { EmployeeBanner, User } from "payload/generated-types";
import { BeforeDuplicate, CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../../../../helper/access";

const beforeDuplicate: BeforeDuplicate<EmployeeBanner> = ({ data }) => {
  return {
    ...data,
    name: `${data.name} Copy`,
  };
};

const EmployeeBenefitsBanner: CollectionConfig = {
  slug: "employee-banner",
  labels: {
    plural: "Employee Banners",
    singular: "Employee Banner",
  },
  access: {
    read: async ({ req }) => await _getAccess(req, "read"),
    create: async ({ req }) => await _getAccess(req, "create"),
    update: async ({ req }) => await _getAccess(req, "update"),
    admin: async ({ req }) => await _getAccess(req, "admin"),
    delete: async ({ req }) => await _getAccess(req, "delete"),
  },
  admin: {
    hidden: ({ user }) => {
      return _isHidden(user as unknown as User, "employee-benefits");
    },
    hooks: { beforeDuplicate },
    useAsTitle: "name",
    defaultColumns: ["name, media, _status"],
    listSearchableFields: ["name"],
    group: {
      Survey: "Employee",
    },
  },
  timestamps: true,
  versions: {
    drafts: true,
  },
  fields: [
    { type: "text", label: "Name", name: "name", required: true, unique: true },
    {
      name: "media",
      label: "File",
      type: "relationship",
      relationTo: "media",
      required: true,
    },
    { type: "text", label: "Link", name: "link" },
  ],
};

export default EmployeeBenefitsBanner;
