import { User } from "payload/generated-types";
import { CollectionConfig } from "payload/types";
import { _getAccess, _isHidden } from "../../../helper/access";

const EmployeeBenefits: CollectionConfig = {
  slug: "employee-benefits",
  labels: {
    plural: "Employee Benefits",
    singular: "Employee Benefit",
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
    useAsTitle: "name",
    defaultColumns: ["name"],
    listSearchableFields: ["name"],
    group: {
      Survey: "Employee",
    },
  },
  timestamps: true,
  versions: {
    drafts: true,
  },
  endpoints: [
    {
      path: "/category/:id",
      method: "get",
      handler: async (req, res, next) => {
        const { id } = req.params;
        const { limit, page, sort } = req.query;

        const response = await req.payload.find({
          collection: "employee-benefits",
          where: {
            "general_info.category": {
              in: id,
            },
          },
          limit: Number(limit),
          page: Number(page),
          sort: sort as string,
        });

        res.status(200).send({ ...response });
      },
    },
    {
      path: "/search/:keyword",
      method: "get",
      handler: async (req, res, _) => {
        let { keyword } = req.params;
        keyword = keyword ? `%${keyword}%` : `%%`;
        const { limit, page, sort } = req.query;

        const response = await req.payload.find({
          collection: "employee-benefits",
          where: {
            _status: {
              equals: "published",
            },
            or: [
              {
                name: {
                  like: keyword,
                },
              },
              {
                "general_info.category.name": { like: keyword },
              },
              {
                "contact_info.phone": { like: `%${keyword}%` },
              },
              {
                "contact_info.email": { like: `%${keyword}%` },
              },
              {
                "contact_info.point_of_contact": { like: `%${keyword}%` },
              },
              {
                "contact_info.address": { like: `%${keyword}%` },
              },
              {
                "benefits.title": { like: keyword },
              },
              {
                "benefits.description": { like: keyword },
              },
              {
                "terms_and_condition.children.text": { like: keyword },
              },
            ],
          },
          limit: Number(limit),
          page: Number(page),
          sort: sort as string,
        });

        res.status(200).send({ ...response });
      },
    },
  ],
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    {
      type: "group",
      label: "General Info",
      name: "general_info",
      fields: [
        {
          name: "category",
          label: "Category",
          type: "relationship",
          relationTo: "employee-benefits-category",
          required: true,
          hasMany: true,
        },
        {
          name: "media",
          label: "Logo / Thumbnail",
          type: "relationship",
          relationTo: "media",
        },
      ],
    },
    {
      type: "group",
      label: "Contact Information",
      name: "contact_info",
      fields: [
        { name: "phone", label: "Phone", type: "text" },
        { name: "email", label: "Email", type: "text" },
        { name: "point_of_contact", label: "Point of Contact", type: "text" },
        { name: "address", label: "Address", type: "text" },
      ],
    },
    {
      name: "expiry_date",
      label: "Expiry Date",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "external_link",
      label: "External Link",
      type: "text",
    },
    {
      type: "array",
      name: "benefits",
      label: "Benefits",
      fields: [
        { type: "text", name: "title", label: "Title" },
        { type: "textarea", name: "description", label: "Description" },
        {
          type: "row",
          fields: [
            { type: "text", name: "printemps", label: "Printemps" },
            { type: "text", name: "dohaoasis", label: "Doha Oasis" },
            { type: "text", name: "banyantree", label: "Banyan Tree" },
          ],
        },
      ],
    },
    {
      type: "array",
      name: "attachments",
      label: "Attachments",
      fields: [
        {
          name: "media",
          label: "File",
          type: "relationship",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "terms_and_condition",
      label: "Terms and condition",
      type: "richText",
    },
  ],
};

export default EmployeeBenefits;
