import { FRONTEND_URL } from "../constant";
import { Payload } from "payload";
import { generateEmployeeSurveyHTML } from "../helper/email-templates/employee-survey";

export const emailSend = async (email: string, payload: Payload) => {
  const collectionName = "employee-questions-email-status";
  const item = await payload.create({
    collection: collectionName,
    data: {
      email: email,
      status: "pending",
    },
  });

  const urlEmail = `${FRONTEND_URL}/employee?id=${item.id}`;

  const response = await payload.sendEmail({
    to: email,
    subject: "Doha Oasis Employee Survey",
    html: generateEmployeeSurveyHTML(urlEmail),
  });

  const msg: string = response["response"] || "";
  const rejected: [] = response["rejected"] || [];
  console.log("sendEmail.msg", msg);

  if (rejected.length > 0)
    throw new Error("Error sending email: " + msg, { cause: msg || "" });

  await payload.update({
    collection: collectionName,
    data: {
      email: email,
      status: "sent",
    },
    where: {
      email: {
        equals: email,
      },
    },
  });

  return response;
};
