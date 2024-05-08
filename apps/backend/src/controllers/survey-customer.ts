import { Router } from "express";
import { getCurrentDateForSQL } from "../helper/date";
import { db } from "../db";
import logger from "../helper/logger";

const surveyCustomerController = Router();

surveyCustomerController.get("/feedbacks", async (req, res) => {
  try {
    const data = await db("survey_customer")
      .select()
      .orderBy("updated_at", "desc");

    res.status(200).json(data);
  } catch (error) {
    logger.info(`Error fetch feedback: ${(error as any)?.message}`);
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

surveyCustomerController.post("/feedback", async (req, res) => {
  try {
    logger.info(`/feedback: ${JSON.stringify(req.body)}`);

    const {
      visit_date,
      meal_period,
      visit_frequency,
      rating_greeting,
      rating_service,
      rating_beverage,
      rating_food,
      rating_value_for_money,
      rating_cleanliness,
      discovery_method,
      will_visit_again,
      manager_visit,
      favorite_restaurant,
      additional_comments,
      name,
      telephone_number,
      birth_date,
      email_address,
      marketing_consent,
      discovery_text,
      visited_restaurant,
      receipt_id,
    } = req.body;

    await db("survey_customer").insert({
      visit_date,
      meal_period,
      visit_frequency,
      rating_greeting,
      rating_service,
      rating_beverage,
      rating_food,
      rating_value_for_money,
      rating_cleanliness,
      discovery_method,
      will_visit_again,
      manager_visit,
      favorite_restaurant,
      additional_comments,
      name,
      telephone_number,
      birth_date,
      email_address,
      created_at: getCurrentDateForSQL(),
      updated_at: getCurrentDateForSQL(),
      marketing_consent,
      discovery_text,
      visited_restaurant,
      receipt_id,
    });

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    logger.info(`Error inserting feedback: ${(error as any)?.message}`);
    res.status(500).json({ message: "Error submitting feedback" });
  }
});

export default surveyCustomerController;
