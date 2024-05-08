import payload from "payload";
import { Endpoint } from "payload/config";

export const healthEndpoint: Endpoint = {
  path: "/health",
  root: true,
  method: "get",
  handler: async (req, res, _) => {
    payload.logger.info(`[${req.method}] ${req.url},`);
    return res.status(200).send("OK");
  },
};
