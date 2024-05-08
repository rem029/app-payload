import { CollectionConfig } from "payload/types";
import { EmployeeQuestionEmailSender } from "../../../../components/employee-question-send";
import { _getAccess, _isHidden } from "../../../../helper/access";
import { User } from "payload/generated-types";

const EmployeeQuestionsEmailStatus: CollectionConfig = {
  slug: "employee-questions-email-status",
  labels: {
    plural: "Employee Questions Email Status",
    singular: "Employee Questions Email Status",
  },
  access: {
    read: async ({ req }) => await _getAccess(req, "read"),
    create: async ({ req }) => await _getAccess(req, "create"),
    update: async ({ req }) => await _getAccess(req, "update"),
    admin: async ({ req }) => await _getAccess(req, "admin"),
    delete: async ({ req }) => await _getAccess(req, "delete"),
  },
  admin: {
    useAsTitle: "email",
    components: { AfterList: [EmployeeQuestionEmailSender] },
    hidden: ({ user }) => {
      return _isHidden(user as unknown as User, "employee-questions-email-status");
    },
    group: {
      Survey: "Employee",
    },
  },
  timestamps: true,
  fields: [
    {
      name: "anonymous_id",
      label: "Anonymous_id",
      type: "text",
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: "status",
      label: "Status",
      type: "text",
      admin: { readOnly: true },
    },
  ],
};

export default EmployeeQuestionsEmailStatus;
