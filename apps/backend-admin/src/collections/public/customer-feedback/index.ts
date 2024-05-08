import { CollectionConfig, Access } from "payload/types";
import {
  customerFeedbackRatingOptions,
  visitFrequencyOptions,
} from "../../../types";
import { User } from "payload/generated-types";
import { _getAccess, _isHidden } from "../../../helper/access";

const CustomerFeedbacks: CollectionConfig = {
  slug: "survey-customer-feedbacks",
  labels: {
    plural: "Survey Customer Feedbacks",
    singular: "Survey Customer Feedback",
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
      return _isHidden(user as unknown as User, "survey-customer-feedbacks");
    },
    group: {
      Survey: "Customer",
    },
  },
  timestamps: true,
  fields: [
    { name: "visit_date", label: "Visit Date", type: "date" },
    { name: "receipt_id", label: "Receipt ID", type: "text" },
    { name: "visited_restaurant", label: "Visited Restaurant", type: "text" },
    { name: "meal_period", label: "Meal Period", type: "text" },
    {
      name: "visit_frequency",
      label: "Visit Frequency",
      type: "select",
      options: visitFrequencyOptions,
    },
    {
      name: "rating_greeting",
      label: "Rating: Greeting",
      type: "select",
      options: customerFeedbackRatingOptions,
    },
    {
      name: "rating_service",
      label: "Rating: Service",
      type: "select",
      options: customerFeedbackRatingOptions,
    },
    {
      name: "rating_beverage",
      label: "Rating: Beverage",
      type: "select",
      options: customerFeedbackRatingOptions,
    },
    {
      name: "rating_food",
      label: "Rating: Food",
      type: "select",
      options: customerFeedbackRatingOptions,
    },
    {
      name: "rating_value_for_money",
      label: "Rating: Value for Money",
      type: "select",
      options: customerFeedbackRatingOptions,
    },
    {
      name: "rating_cleanliness",
      label: "Rating: Cleanliness",
      type: "select",
      options: customerFeedbackRatingOptions,
    },
    { name: "discovery_method", label: "Discovery Method", type: "text" },
    { name: "will_visit_again", label: "Will Visit Again", type: "text" },
    { name: "manager_visit", label: "Manager Visit", type: "text" },
    { name: "favorite_restaurant", label: "Favorite Restaurant", type: "text" },
    { name: "additional_comments", label: "Additional Comments", type: "text" },
    { name: "name", label: "Name", type: "text" },
    { name: "telephone_number", label: "Telephone Number", type: "text" },
    { name: "birth_date", label: "Birth Date", type: "date" },
    { name: "email_address", label: "Email Address", type: "text" },
    { name: "marketing_consent", label: "Marketing Consent", type: "checkbox" },
    { name: "discovery_text", label: "Discovery Text", type: "text" },
  ],
};

export default CustomerFeedbacks;
