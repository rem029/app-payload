import { Router } from "express";
import { db, dbMssql } from "../db";
import logger from "../helper/logger";

const surveyNpsController = Router();

surveyNpsController.get("/feedbacks", async (req, res) => {
  try {
    const data = await db("survey_nps").select().orderBy("updated_at", "desc");

    res.status(200).json(data);
  } catch (error) {
    logger.info(`Error fetch feedback: ${(error as any)?.message}`);
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

surveyNpsController.post("/feedback", async (req, res) => {
  try {
    logger.info(`/feedback: ${JSON.stringify(req.body)}`);

    const { visit_date, receipt_id, customer_feedback, customer_comments } =
      req.body;

    await db("survey_nps").insert({
      visit_date,
      receipt_id,
      customer_feedback,
      customer_comments,
    });

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    logger.info(`Error inserting feedback: ${(error as any)?.message}`);
    res.status(500).json({ message: "Error submitting feedback" });
  }
});

export default surveyNpsController;
