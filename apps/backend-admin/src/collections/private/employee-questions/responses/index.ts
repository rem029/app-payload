import { CollectionConfig } from "payload/types";
import { employeeRatingOptions } from "../../../../types";
import { EmployeeResponse, User } from "payload/generated-types";
import { _getAccess, _isHidden } from "../../../../helper/access";

const EmployeeResponses: CollectionConfig = {
  slug: "employee-responses",
  labels: {
    plural: "Employee Responses",
    singular: "Employee Responses",
  },
  access: {
    read: async ({ req }) => await _getAccess(req, "read"),
    create: async ({ req }) => await _getAccess(req, "create"),
    update: async ({ req }) => await _getAccess(req, "update"),
    admin: async ({ req }) => await _getAccess(req, "admin"),
    delete: async ({ req }) => await _getAccess(req, "delete"),
  },
  timestamps: true,
  admin: {
    useAsTitle: "id",
    hidden: ({ user }) => {
      return _isHidden(user as unknown as User, "employee-responses");
    },
    group: {
      Survey: "Employee",
    },
  },
  hooks: {
    afterOperation: [
      async ({ operation, req, result }) => {
        const empResult = result as EmployeeResponse;
        if (operation === "create") {
          const response = await req.payload.update({
            collection: "employee-questions-email-status",
            data: { status: "responded" },
            where: {
              anonymous_id: {
                equals: empResult.anonymous_id,
              },
            },
          });
        }

        return result;
      },
    ],
  },
  endpoints: [
    {
      path: "/find/:id",
      method: "get",
      handler: async (req, res, next) => {
        const { id } = req.params;
        const response = await req.payload.find({
          collection: "employee-responses",
          where: {
            anonymous_id: {
              equals: id,
            },
          },
        });

        res.status(200).send({ ...response });
      },
    },
  ],
  fields: [
    {
      name: "anonymous_id",
      label: "Anonymous ID",
      type: "text",
      unique: true,
      required: true,
      admin: { readOnly: true },
    },
    {
      name: "department",
      label: "Department",
      type: "text",
      admin: { readOnly: true },
    },
    {
      name: "department_sub",
      label: "Sub Department",
      type: "text",
      admin: { readOnly: true },
    },
    {
      name: "employee_comments",
      label: "Comment",
      type: "textarea",
      admin: { readOnly: true },
    },
    {
      name: "questions",
      label: " Questions",
      type: "array",
      admin: { readOnly: true },
      fields: [
        {
          name: "question",
          label: "Question",
          relationTo: "employee-questions",
          type: "relationship",
          required: true,
          admin: {
            sortOptions: "id",
          },
        },
        {
          name: "response",
          label: "response",
          type: "select",
          options: employeeRatingOptions,
          required: true,
        },
      ],
    },
  ],
};

export default EmployeeResponses;
