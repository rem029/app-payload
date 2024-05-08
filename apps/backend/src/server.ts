// server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import logger from "./helper/logger";
import receiptIDController from "./controllers/receipt-id";
import authADController from "./controllers/auth-ad";

dotenv.config();

const ENVIRONMENT = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));

app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.url}`);
  next();
});

// app.use("/net-promoter", surveyNpsController);
// app.use("/customer", surveyCustomerController);
app.use("/receipt-id", receiptIDController);
app.use("/auth-ad", authADController);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}, ${ENVIRONMENT}`);
});
