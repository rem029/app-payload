import { CollectionConfig } from "payload/types";
import { User } from "payload/generated-types";
import { _getAccess, _isHidden } from "../../../helper/access";

const iFlyWaiverForms: CollectionConfig = {
  slug: "ifly-waiver-forms",
  labels: {
    plural: "iFly Waiver Forms",
    singular: "iFly Waiver Form",
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
      return _isHidden(user as unknown as User, "ifly-waiver-forms");
    },
    group: {
      "iFly Waiver": "Doha Quest",
    },
  },
  timestamps: true,
  fields: [
    { name: "name", label: "Name", type: "text", required: true, index: true },
    {
      name: "qid",
      label: "QID / Password#",
      type: "text",
      required: true,
      index: true,
      minLength: 8,
      maxLength: 13,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      required: true,
      index: true,
    },
    {
      name: "dependents",
      label: "Dependent(s)",
      type: "array",
      fields: [
        { name: "name", label: "Name", type: "text", required: true, index: true },
        {
          name: "qid",
          label: "QID / Password#",
          type: "text",
          required: true,
          index: true,
          minLength: 8,
          maxLength: 13,
        },
        {
          name: "phone",
          label: "Phone",
          type: "text",
          required: false,
          index: true,
        },
      ],
    },
    {
      name: "signature_svg",
      label: "Signature",
      type: "code",
      required: true,
    },
  ],
};

export default iFlyWaiverForms;
