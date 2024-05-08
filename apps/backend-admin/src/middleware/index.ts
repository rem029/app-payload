import { NextFunction, Response } from "express";
import payload from "payload";
import { PayloadRequest } from "payload/types";

export const errorMiddleware = async (
  err,
  req: PayloadRequest,
  res: Response,
  _: NextFunction,
) => {
  const logMsg = `[${req.method}] ${req.url}, error`;
  payload.logger.error(logMsg);
  console.error(logMsg, err.stack);

  const statusCode = err?.statusCode || 500;

  res.status(statusCode).send({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};

export const authMiddleware = async (
  req: PayloadRequest,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as PayloadRequest).user?.email || "unauth";
  const logMsg = `[${req.method}] ${req.url}, user: ${user}`;
  const originalLogMsg = `[${req.method}] original: ${req.originalUrl}, user: ${user}`;

  payload.logger.info(logMsg);
  payload.logger.info(originalLogMsg);

  console.log(logMsg, "body:", req.body);

  if (user === "unauth" || !user) {
    payload.logger.error(logMsg + " Unauthorized");
    return res.status(401).send("UNAUTHORIZED");
  }

  next();
};
