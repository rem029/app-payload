import { retrieveKeysFromPayload } from "../helper/keys";
import { createAndFetchMessage } from "../controllers/ai";
import { Endpoint } from "payload/config";
import payload from "payload";

export const aiEndpoint: Endpoint = {
  path: "/ai/chat",
  root: false,
  method: "post",
  handler: async (req, res, next) => {
    const { content, threadId } = req.body;
    payload.logger.info(`[${req.method}] ${req.url} ${content}, ${threadId}`);

    try {
      const keys = await retrieveKeysFromPayload(
        [
          "OPEN_AI_KEY",
          "OPEN_AI_ASSISTANT_KEY",
          "OPEN_AI_INSTRUCTION",
          "OPEN_AI_INSTRUCTION_ADDITIONAL",
        ],
        req,
      );

      const messages = await createAndFetchMessage(content, {
        threadId: threadId,
        apiKey: keys["OPEN_AI_KEY"],
        apiAssistantKey: keys["OPEN_AI_ASSISTANT_KEY"],
        instruction: keys["OPEN_AI_INSTRUCTION"],
        additional_instruction: keys["OPEN_AI_INSTRUCTION_ADDITIONAL"],
        payload: req.payload,
      });

      payload.logger.info(
        `[${req.method}] ${req.url} ${200} ${content}, ${threadId}`,
      );
      res.status(200).send({ response: { ...messages } });
    } catch (error) {
      next(error);
    }
  },
};
