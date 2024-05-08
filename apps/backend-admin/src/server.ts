require("dotenv").config();

import express from "express";
import payload from "payload";
import cors from "cors";
import { emailTransport } from "./services/email";
import { ENV, NODE_MAILER_FROM } from "./constant";
import { authMiddleware, errorMiddleware } from "./middleware";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      payload.logger.info(`Payload Environment: ${ENV}`);
    },
    email: {
      transport: emailTransport,
      fromName: "Employee survey",
      fromAddress: NODE_MAILER_FROM,
    },
  });

  // middlewares
  app.use(payload.authenticate);
  app.use(errorMiddleware);
  app.use(authMiddleware);

  app.listen(PORT);
};

start();
