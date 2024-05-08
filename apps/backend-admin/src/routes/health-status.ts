import payload from "payload";
import { Endpoint } from "payload/config";
import { checkStatus } from "../controllers/health-status";

export const healthStatusEndPoint: Endpoint = {
  path: "/health/status",
  root: false,
  method: "get",
  handler: async (req, res, next) => {
    payload.logger.info(
      `[${req.method}] ${req.url}, User: ${req.user?.email || ""}`,
    );

    if (!req.user) {
      return res.status(400).send("Unauthorized");
    }

    const { url } = req.query;

    try {
      if (url) {
        const decodedUrl = decodeURIComponent(url as string);
        const statusResponse = await checkStatus(decodedUrl);

        payload.logger.info(`[${req.method}] ${req.url} 200`);
        res.status(200).send({
          response: statusResponse,
        });
      } else {
        const urls = (
          await req.payload.find({ collection: "health-check", limit: 100000 })
        ).docs;

        const statusReports = await Promise.all(
          urls.map((urlObj) => checkStatus(urlObj.url)),
        );

        payload.logger.info(`[${req.method}] ${req.url} 200`);
        res.status(200).send({
          response: statusReports,
        });
      }
    } catch (error) {
      payload.logger.info(`[${req.method}] ${req.url} 500 ${error.message}`);
      next(error);
    }
  },
};
