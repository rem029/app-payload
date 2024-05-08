import { CollectionConfig, Access } from "payload/types";
import { netPromoterOptions } from "../types";
import { _getAccess, _isHidden } from "../helper/access";
import { User } from "payload/generated-types";

const SurveyNetPromoters: CollectionConfig = {
  slug: "survey-net-promoter",
  labels: {
    plural: "Survey Net Promoters",
    singular: "Survey Net Promoter",
  },
  access: {
    read: async ({ req }) => await _getAccess(req, "read"),
    create: async ({ req }) => await _getAccess(req, "create"),
    update: async ({ req }) => await _getAccess(req, "update"),
    admin: async ({ req }) => await _getAccess(req, "admin"),
    delete: async ({ req }) => await _getAccess(req, "delete"),
  },
  admin: {
    useAsTitle: "customer_comments",
    hidden: ({ user }) => {
      return _isHidden(user as unknown as User, "survey-net-promoter");
    },
    group: {
      Survey: "Customer",
    },
  },
  timestamps: true,
  fields: [
    { name: "visit_date", label: "Visit Date", type: "date" },
    { name: "receipt_id", label: "Receipt ID", type: "text" },
    {
      name: "customer_feedback",
      label: "Customer Feedback",
      type: "select",
      options: netPromoterOptions,
    },
    {
      name: "customer_feedback_number",
      label: "Customer Feedback Number",
      type: "number",
    },
    { name: "customer_comments", label: "Customer Comments", type: "textarea" },
  ],
};

export default SurveyNetPromoters;
