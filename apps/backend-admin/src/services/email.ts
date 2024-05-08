import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {
  ENV,
  NODE_MAILER_FROM,
  NODE_MAILER_HOST,
  NODE_MAILER_PASS,
  NODE_MAILER_PORT,
  NODE_MAILER_USER,
} from "../constant";
import Email from "email-templates";

export const emailTransport = nodemailer.createTransport({
  host: NODE_MAILER_HOST,
  auth: {
    user: NODE_MAILER_USER,
    pass: NODE_MAILER_PASS,
  },
  port: Number(NODE_MAILER_PORT),
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  // logger: ENV === "development",
  // debug: ENV === "development",
  // logger: true,
  // debug: true,
} as SMTPTransport.Options);

export const emailTransportWithTemplate = new Email({
  preview: ENV === "development",
  send: true,
  message: { from: NODE_MAILER_FROM },
  transport: emailTransport,
});
