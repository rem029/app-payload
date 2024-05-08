import { Option } from "payload/types";

export type AccessType =
  | "read"
  | "access"
  | "create"
  | "update"
  | "admin"
  | "delete"
  | "hidden";
export type AccessUser = "user" | "reviewer" | "admin";

export const visitFrequencyOptions: Option[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "First time", value: "first-time" },
];

export const customerFeedbackRatingOptions: Option[] = [
  { label: "Poor", value: "poor" },
  { label: "Average", value: "average" },
  { label: "Good", value: "good" },
  { label: "Very Good", value: "very-good" },
  { label: "Excellent", value: "excellent" },
];

export const employeeRatingOptions: Option[] = [
  { label: "Strongly disagree", value: "strongly-disagree" },
  { label: "Disagree", value: "disagree" },
  { label: "I do not know", value: "i-do-not-know" },
  { label: "Agree", value: "agree" },
  { label: "Strongly agree", value: "strongly-agree" },
];

export const netPromoterOptions: Option[] = [
  { label: "Sad", value: "detractor" },
  { label: "Neutral", value: "neutral" },
  { label: "Happy", value: "promoter" },
];
