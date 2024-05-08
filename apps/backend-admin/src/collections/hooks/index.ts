import { ChatSearchFile, Media } from "payload/generated-types";
import { CollectionBeforeChangeHook } from "payload/types";
import fs from "fs";
import pdf from "pdf-parse";
import axios from "axios";

export const beforeChangeChatSearchFilesHook: CollectionBeforeChangeHook<
  ChatSearchFile
> = async ({ data, req, operation }) => {
  if (operation === "create" || operation === "update") {
    try {
      let media: Media;

      if (typeof data.media === "number") {
        const doc = await req.payload.find({
          collection: "media",
          where: { id: { equals: data.media } },
        });

        media = doc.docs[0];
      } else {
        media = data.media;
      }

      req.payload.logger.info(`New Chat search file, operation:${operation}`);
      req.payload.logger.info(`New Chat search file, ${media.url}`);

      const pdfURL = media.url;
      const response = await axios({
        url: pdfURL,
        method: "GET",
        responseType: "arraybuffer",
      });
      const pdfFilePath = `/tmp/${media.filename}`; // Path to save downloaded file
      await fs.promises.writeFile(pdfFilePath, response.data);

      req.payload.logger.info(`New Chat search file, ready on temp ${pdfFilePath}`);

      const pdfBuffer = await fs.promises.readFile(pdfFilePath);
      const pdfData = await pdf(pdfBuffer);

      req.payload.logger.info(`New Chat search file, read done`);
      data.parsed_text = pdfData.text;
    } catch (error) {
      data.parsed_text = `unable to parse text. error: ${error.message}`;
    }
  }

  return data;
};
