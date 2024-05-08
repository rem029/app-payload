import { Router } from "express";
import { db, dbMssql } from "../db";
import logger from "../helper/logger";

const receiptIDController = Router();

receiptIDController.get("/:receipt_id/:survey", async (req, res) => {
  try {
    logger.info(`/receiptID: ${JSON.stringify(req.body)}`);

    let { receipt_id, survey } = req.params;

    if (!survey) {
      res.status(404).json({ message: "Survey param not found" });
      return;
    }

    if (survey === "nps") survey = "survey_net_promoter";
    if (survey === "customer") survey = "survey_net_promoter";

    const existingItem = await db(survey)
      .select()
      .where("receipt_id", receipt_id)
      .first();

    if (existingItem) {
      res.status(404).json({ message: "Receipt ID already has feedback" });
      return;
    }

    const response: any[] = await dbMssql.raw(
      `
        SELECT *
        FROM PD_CustInfoSurvey
        WHERE RECEIPTID = ?
        ORDER BY Date DESC;
      `,
      [receipt_id],
    );

    if (!response || !(response.length > 0)) {
      res.status(404).json({ message: "Receipt ID not found" });
      return;
    }

    res.status(201).json({ response });
  } catch (error) {
    logger.info(`Error fetching receiptID: ${(error as any)?.message}`);
    res.status(500).json({ message: "Error fetching receipt ID" });
  }
});

export default receiptIDController;
