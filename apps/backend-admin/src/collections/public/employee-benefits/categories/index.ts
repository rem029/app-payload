import { User } from "payload/generated-types";
import { CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../../../../helper/access";

const EmployeeBenefitsCategory: CollectionConfig = {
  slug: "employee-benefits-category",
  labels: {
    plural: "Employee Benefit Categories",
    singular: "Employee Benefit Category",
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
      return _isHidden(user as unknown as User, "employee-benefits-category");
    },
    useAsTitle: "name",
    group: {
      Survey: "Employee",
    },
  },
  timestamps: true,
  fields: [{ name: "name", label: "Name", type: "text" }],
};

export default EmployeeBenefitsCategory;
