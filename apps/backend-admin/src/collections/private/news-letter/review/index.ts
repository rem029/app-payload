import { CollectionConfig } from "payload/types";

import { _getAccess, _isHidden } from "../../../../helper/access";
import { User } from "payload/generated-types";

const NewsLetterReviews: CollectionConfig = {
  slug: "news-letters-reviews",
  labels: {
    plural: "News letter reviews",
    singular: "News letter review",
  },
  access: {
    read: async ({ req }) => await _getAccess(req, "read"),
    create: async ({ req }) => await _getAccess(req, "create"),
    update: async ({ req }) => await _getAccess(req, "update"),
    admin: async ({ req }) => await _getAccess(req, "admin"),
    delete: async ({ req }) => await _getAccess(req, "delete"),
  },
  admin: {
    useAsTitle: "title",
    hidden: ({ user }) => {
      return _isHidden(user as unknown as User, "news-letters-reviews");
    },
  },
  timestamps: true,
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          description: "Content for review",
          // access: {
          //   update: (d) => getAccess("update", "news-letters-reviews-content", d),
          // },
          fields: [
            {
              name: "title",
              label: "Title",
              type: "text",
            },
            { name: "description", label: "Description", type: "textarea" },
            {
              name: "operator",
              label: "Operator",
              type: "relationship",
              relationTo: "operators",
            },
            {
              name: "post_date",
              label: "Post date",
              type: "date",
              admin: {
                date: { pickerAppearance: "dayAndTime" },
              },
            },
            {
              name: "newsletter",
              label: "News letter",
              type: "relationship",
              relationTo: "news-letter",
            },
          ],
        },
        {
          label: "Comments",
          description: "Reviewer's comment's",
          fields: [
            {
              name: "comments",
              label: "Comment(s)",
              type: "array",
              fields: [
                { name: "comment", label: "Comment(s)", type: "textarea" },
                {
                  name: "user",
                  label: "User",
                  type: "text",
                  admin: { readOnly: true },
                  defaultValue: ({ user }) => {
                    return user.email ? user.email : "unknown";
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default NewsLetterReviews;
