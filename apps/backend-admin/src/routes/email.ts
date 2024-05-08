import { PayloadRequest } from "payload/types";
import { emailSend } from "../controllers/email";
import { Endpoint } from "payload/config";

export const emailSenderEndpoint: Endpoint = {
  path: "/email/send",
  root: false,
  method: "post",
  handler: async (req, res, next) => {
    const { email } = req.body;
    const payload = (req as PayloadRequest).payload;
    const collectionName = "employee-questions-email-status";

    try {
      const response = await emailSend(email, payload);
      payload.logger.info(`[${req.method}] ${req.url} ${200}`);
      res.status(200).send({ response });
    } catch (error) {
      await payload.update({
        collection: collectionName,
        data: {
          email: email,
          status: "error",
        },
        where: {
          email: {
            equals: email,
          },
        },
      });
      payload.logger.error(`[${req.method}] ${req.url} ${500} ${error.message}`);
      next(error);
    }
  },
};
