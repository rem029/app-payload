import { Fragment, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import moment from "moment";
import { FaCalendar, FaLightbulb, FaStar, FaUtensils } from "react-icons/fa";
import { BsInfoSquareFill } from "react-icons/bs";
import { AiFillLike } from "react-icons/ai";
import { MdFoodBank } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import {
  SurveyCustomerFeedback,
  CustomerRatingOptions,
  NetPromoterFeedback,
  CustomerInfo,
} from "../../../types";
import { API_SURVEY_URL, API_VERIFY_URL } from "../../../utils/constants";
import RadioGroup from "../../common/radio-group";
import Rating from "../../common/rating";
import { updateCurrentDate, updateCurrentTime } from "../../../helpers";
import SuccessMessageForm from "../success-message";
import content from "../../../utils/contents";
import CustomerSurveyCard from "../../common/card";
import CustomerSurveyCashier from "./cashier";
import ErrorMessage from "../../common/error-message";
import { axiosPayloadClient } from "../../../utils/config";

interface SurveyWithNetPromoterFeedback
  extends SurveyCustomerFeedback,
    NetPromoterFeedback {}

const defaultFields: SurveyWithNetPromoterFeedback = {
  visit_date: moment().toISOString(true),
  customer_comments: "",
  customer_feedback_number: 0,
  receipt_id: "",
  transaction_type: "Retail",
  visited_restaurant: "Please choose",
  favorite_restaurant: "Please choose",
};

export const CustomerSurvey = ({ type }: CustomerSurveyProps) => {
  const [step, setStep] = useState<"cashier" | "customer">("cashier");
  const [feedbackFields, setFeedbackFields] =
    useState<SurveyWithNetPromoterFeedback>(defaultFields);

  const [formError, setFormError] = useState("");

  // const [captchaInput, setCaptchaInput] = useState("");
  // const [captchError, setCaptchaError] = useState("");
  // const { captcha, generateCaptcha } = useCaptcha();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [isValidReceiptID, setIsValidReceiptID] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | undefined>();

  const isRetailTransaction = useMemo(() => {
    return feedbackFields.transaction_type.toLowerCase() === "retail";
  }, [feedbackFields]);

  const defaultTransactionType = useMemo(() => {
    const transactionType = type;

    if (transactionType === "fnb") return "Food and Beverage";
    if (transactionType === "retail") return "Retail";

    return undefined;
  }, [type]);

  useEffect(() => {
    if (defaultTransactionType) {
      setFeedbackFields((prevState) => ({
        ...prevState,
        transaction_type: defaultTransactionType,
      }));
    }
  }, [defaultTransactionType]);

  useEffect(() => {
    if (type === "retail") setStep("cashier");
    if (type === "fnb") setStep("customer");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setCaptchaError("");
    // if (captchaInput !== captcha) {
    //   setCaptchaError("Captcha doesnt not match. Please try again");
    //   resetCaptcha();
    //   return;
    // }
    try {
      setSubmitLoading(true);
      const convertRatingValue = (value: string) =>
        value.replaceAll(" ", "-").toLowerCase();

      const body = {
        ...feedbackFields,
        ...(feedbackFields?.rating_beverage && {
          rating_beverage: convertRatingValue(feedbackFields?.rating_beverage || ""),
        }),
        ...(feedbackFields?.rating_cleanliness && {
          rating_cleanliness: convertRatingValue(
            feedbackFields?.rating_cleanliness || "",
          ),
        }),
        ...(feedbackFields?.rating_food && {
          rating_food: convertRatingValue(feedbackFields?.rating_food || ""),
        }),
        ...(feedbackFields?.rating_greeting && {
          rating_greeting: convertRatingValue(feedbackFields?.rating_greeting || ""),
        }),
        ...(feedbackFields?.rating_service && {
          rating_service: convertRatingValue(feedbackFields?.rating_service || ""),
        }),
        ...(feedbackFields?.rating_value_for_money && {
          rating_value_for_money: convertRatingValue(
            feedbackFields?.rating_value_for_money || "",
          ),
        }),
        ...(feedbackFields?.visit_frequency && {
          visit_frequency: convertRatingValue(feedbackFields?.visit_frequency || ""),
        }),
        discovery_text:
          feedbackFields.discovery_method === "Other"
            ? feedbackFields.discovery_text
            : "",
        favorite_restaurant:
          feedbackFields.favorite_restaurant?.toLowerCase() === "please choose"
            ? ""
            : feedbackFields.favorite_restaurant,
        visited_restaurant:
          feedbackFields.visited_restaurant?.toLowerCase() === "please choose"
            ? ""
            : feedbackFields.visited_restaurant,
      };

      const sendNetPromoter = async () => {
        const response = await axiosPayloadClient.post(
          `/api/survey-net-promoter`,
          body,
        );

        if (response.status !== 201) {
          throw Error(
            "Something went wrong while submitting your form. Please contact admin.",
          );
        }

        return;
      };

      const sendCustomerFeedback = async () => {
        const response = await axiosPayloadClient.post(
          `${API_SURVEY_URL}/api/survey-customer-feedbacks`,
          body,
        );

        if (response.status !== 201) {
          throw Error(
            "Something went wrong while submitting your form. Please contact admin.",
          );
        }

        return;
      };

      if (isRetailTransaction) {
        await sendNetPromoter();
      } else {
        await sendCustomerFeedback();
        await sendNetPromoter();
      }

      setShowSuccess(true);
      resetForm();
    } catch (error) {
      setFormError((error as Error)?.message || "Unknown error");
      resetCaptcha();
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChangeValue = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    let { value, name } = e.target;
    console.log("@", { value, name });
    // Checkbox change
    if (name.includes("marketing_consent")) {
      handleCheckBoxChange(e as React.ChangeEvent<HTMLInputElement>);
      return;
    }

    if (name.includes("visit_date")) {
      value = name.includes(".date")
        ? updateCurrentDate(feedbackFields.visit_date, value)
        : updateCurrentTime(feedbackFields.visit_date, value);
      value = moment(value).toISOString(true);
      name = "visit_date";
    }

    if (
      name.includes("meal_period") ||
      name.includes("visit_frequency") ||
      name.includes("discovery_method") ||
      name.includes("will_visit_again") ||
      name.includes("manager_visit") ||
      (name.includes("customer_feedback") &&
        !name.includes("customer_feedback_number")) ||
      name.includes("transaction_type")
    ) {
      const [newName, newValue] = name.split(":");
      name = newName;
      value = newValue;
    }

    if (name.includes("rating_")) {
      const [newName, newValue] = name.split(":");
      name = newName;
      value = getKeyByValue(Number(newValue)) || "";
    }

    if (name.includes("customer_feedback_number")) {
      const feedbackValue = Number(value);
      let customerFeedback = "neutral";

      if (feedbackValue <= 4) {
        customerFeedback = "detractor";
      }
      if (feedbackValue > 4 && feedbackValue < 8) {
        customerFeedback = "neutral";
      }
      if (feedbackValue >= 8) {
        customerFeedback = "promoter";
      }

      setFeedbackFields((prevState) => ({
        ...prevState,
        customer_feedback: customerFeedback,
      }));
    }

    setFeedbackFields((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { checked, name } = e.target;
    setFeedbackFields((prevState) => ({ ...prevState, [name]: checked }));
  };

  const resetForm = () => {
    setFeedbackFields(defaultFields);
    resetCaptcha();
  };

  const resetCaptcha = () => {
    // generateCaptcha();
    // setCaptchaInput("");
  };

  const getRatingNumberValue = (value: string | undefined) => {
    if (!value) return 0;
    return CustomerRatingOptions[value] ? CustomerRatingOptions[value] : 0;
  };

  const getKeyByValue = (value: number): string | undefined => {
    for (const [key, val] of Object.entries(CustomerRatingOptions)) {
      if (val === value) return key;
    }

    return undefined;
  };

  const handleValidateReceiptID = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!feedbackFields.receipt_id) return;

    setCustomerInfo(undefined);
    axiosPayloadClient
      .get(`${API_VERIFY_URL}/receipt-id/${feedbackFields.receipt_id}/customer`)
      .then((response) => {
        if (response.data.response) {
          setFormError("");
          setCustomerInfo({
            customerName: response.data.response[0].CustomerName,
            date: response.data.response[0].Date,
          });
          setIsValidReceiptID(true);
        }
      })
      .catch((error: AxiosError) => {
        setCustomerInfo(undefined);
        setFormError(
          error.status === 404
            ? error.message
            : (error.response?.data as any)?.message || "",
        );
        setIsValidReceiptID(false);
      });
  };

  return (
    <>
      {showSuccess && <SuccessMessageForm />}
      {!showSuccess && (
        <>
          {step === "cashier" && (
            <CustomerSurveyCashier
              customerInfo={customerInfo}
              feedbackFields={feedbackFields}
              handleChangeValue={handleChangeValue}
              handleValidateReceiptID={handleValidateReceiptID}
              isValidReceiptID={isValidReceiptID}
              setFeedbackFields={setFeedbackFields}
              setFormError={setFormError}
              setStep={setStep}
              submitLoading={submitLoading}
              hideTransactionType={
                defaultTransactionType !== undefined ? true : false
              }
            />
          )}
          {step === "customer" && (
            <div className="w-full h-screen overflow-x-hidden overflow-y-auto max-md:px-4 px-12 max-md:py-4 p-8 flex flex-col flex-1 items-start relative">
              <ErrorMessage message={formError} onClose={() => setFormError("")} />

              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-16 max-md:gap-10"
              >
                <div className="flex flex-col gap-2">
                  <h6 className="text-2xl font-bold text-bold text-primary inline-flex gap-2 items-center">
                    Your Voice, Our Improvement
                  </h6>
                  <p className="text-sm text-info inline-flex gap-2 items-center">
                    Share your dining experience to help us serve you better!
                  </p>
                </div>
                {!isRetailTransaction && (
                  <>
                    <CustomerSurveyCard animate elavate>
                      <div className="flex flex-col gap-2">
                        <h6 className="text-xl font-bold text-bold text-primary inline-flex gap-2 items-center">
                          <BsInfoSquareFill className="opacity-50" />
                          Your Visit Details
                        </h6>
                        <div className="h-[2px] w-full bg-primary" />
                      </div>
                      <div className="flex flex-col gap-4 flex-wrap">
                        <div className="flex flex-col gap-1">
                          <span className="text-primary font-bold">
                            Date and time
                          </span>
                          <span className="text-info">
                            {moment(feedbackFields.visit_date).format(
                              "ddd, yyyy MMM DD",
                            ) +
                              " at " +
                              moment(feedbackFields.visit_date).format("HH:mm A")}
                          </span>
                        </div>
                        {type === "fnb" && (
                          <label className="form-control w-full max-w-lg">
                            <div className="label"></div>
                            <input
                              type="text"
                              name="receipt_id"
                              value={feedbackFields.receipt_id}
                              onChange={handleChangeValue}
                              placeholder="Receipt ID here..."
                              className="input input-ghost input-md input-primary w-full"
                              disabled={submitLoading || isValidReceiptID}
                            />
                          </label>
                        )}

                        {/* <label className="form-control w-full max-w-lg">
                          <div className="label">
                            <span className="label-text text-primary font-bold">
                              Which of our restaurants did you visit?
                            </span>
                          </div>
                          <input
                            type="text"
                            name="visited_restaurant"
                            value={feedbackFields.visited_restaurant}
                            onChange={handleChangeValue}
                            placeholder="Name..."
                            className="input input-ghost input-md input-primary w-full"
                            disabled={submitLoading}
                          />
                        </label> */}

                        <label className="form-control w-full max-w-lg">
                          <div className="label">
                            <span className="label-text text-primary font-bold">
                              Which of our restaurants did you visit?
                            </span>
                          </div>
                          <select
                            name="visited_restaurant"
                            value={feedbackFields.visited_restaurant}
                            onChange={(e) =>
                              setFeedbackFields((prevState) => ({
                                ...prevState,
                                [e.target.name]: e.target.value,
                              }))
                            }
                            className="select select-bordered select-md input-primary w-full"
                            disabled={submitLoading}
                          >
                            {content.en.restaurants.map((c, index) => {
                              return (
                                <option
                                  key={"visited_restaurant_" + index}
                                  disabled={index === 0}
                                  value={c}
                                >
                                  {c}
                                </option>
                              );
                            })}
                          </select>
                        </label>
                      </div>
                    </CustomerSurveyCard>

                    <CustomerSurveyCard animate elavate>
                      <RadioGroup
                        label={
                          <div className="flex flex-col gap-2">
                            <h6 className="text-xl font-bold text-bold text-primary inline-flex gap-2 items-center">
                              <FaUtensils className="opacity-50" />
                              Meal Period
                            </h6>
                            <div className="h-[2px] w-full bg-primary" />
                          </div>
                        }
                        fullWidth
                        direction="flex-col"
                        name="meal_period"
                        value={feedbackFields.meal_period || ""}
                        onChange={handleChangeValue}
                        items={[
                          { label: "Breakfast" },
                          { label: "Lunch" },
                          { label: "Dinner" },
                        ]}
                        disabled={submitLoading}
                      />
                    </CustomerSurveyCard>

                    <CustomerSurveyCard animate elavate>
                      <RadioGroup
                        label={
                          <div className="flex flex-col gap-2">
                            <h6 className="text-xl font-bold text-bold text-primary inline-flex gap-2 items-center">
                              <FaCalendar className="opacity-50" />
                              How often do you visit our restaurant?
                            </h6>
                            <div className="h-[2px] w-full bg-primary" />
                          </div>
                        }
                        fullWidth
                        direction="flex-col"
                        name="visit_frequency"
                        value={feedbackFields.visit_frequency || ""}
                        onChange={handleChangeValue}
                        items={[
                          { label: "Daily" },
                          { label: "Weekly" },
                          { label: "Monthly" },
                          { label: "First time" },
                        ]}
                        disabled={submitLoading}
                      />
                    </CustomerSurveyCard>

                    <CustomerSurveyCard animate elavate>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <h6 className="text-xl font-bold text-bold text-primary inline-flex gap-2 items-center">
                            <FaStar className="opacity-50" />
                            How would you rate your dining experience?
                          </h6>
                          <div className="h-[2px] w-full bg-primary" />
                        </div>
                        <Rating
                          label="Greeting"
                          name="rating_greeting"
                          count={5}
                          value={getRatingNumberValue(
                            feedbackFields.rating_greeting,
                          )}
                          valueLabel={feedbackFields.rating_greeting}
                          onChange={handleChangeValue}
                          disabled={submitLoading}
                        />
                        <Rating
                          label="Service"
                          name="rating_service"
                          count={5}
                          value={getRatingNumberValue(
                            feedbackFields.rating_service || "",
                          )}
                          valueLabel={feedbackFields.rating_service}
                          onChange={handleChangeValue}
                          disabled={submitLoading}
                        />
                        <Rating
                          label="Food"
                          name="rating_food"
                          count={5}
                          value={getRatingNumberValue(
                            feedbackFields.rating_food || "",
                          )}
                          valueLabel={feedbackFields.rating_food}
                          onChange={handleChangeValue}
                          disabled={submitLoading}
                        />
                        <Rating
                          label="Beverage"
                          name="rating_beverage"
                          count={5}
                          value={getRatingNumberValue(
                            feedbackFields.rating_beverage || "",
                          )}
                          valueLabel={feedbackFields.rating_beverage}
                          onChange={handleChangeValue}
                          disabled={submitLoading}
                        />
                        <Rating
                          label="Value for money"
                          name="rating_value_for_money"
                          count={5}
                          value={getRatingNumberValue(
                            feedbackFields.rating_value_for_money || "",
                          )}
                          valueLabel={feedbackFields.rating_value_for_money}
                          onChange={handleChangeValue}
                          disabled={submitLoading}
                        />
                        <Rating
                          label="Cleanliness"
                          name="rating_cleanliness"
                          count={5}
                          value={getRatingNumberValue(
                            feedbackFields.rating_cleanliness || "",
                          )}
                          valueLabel={feedbackFields.rating_cleanliness}
                          onChange={handleChangeValue}
                          disabled={submitLoading}
                        />
                      </div>
                    </CustomerSurveyCard>

                    <CustomerSurveyCard animate elavate>
                      <>
                        <RadioGroup
                          label={
                            <div className="flex flex-col gap-2">
                              <h6 className="text-xl font-bold text-bold text-primary inline-flex gap-2 items-center">
                                <FaLightbulb className="opacity-50" />
                                How did you come to know about us?
                              </h6>
                              <div className="h-[2px] w-full bg-primary" />
                            </div>
                          }
                          fullWidth
                          direction="flex-col"
                          name="discovery_method"
                          value={feedbackFields.discovery_method || ""}
                          onChange={handleChangeValue}
                          items={[
                            { label: "Social Media" },
                            { label: "Influencer Recommendations" },
                            { label: "Search Engines like Google, Bing, etc..." },
                            { label: "Word of mouth" },
                            { label: "Website" },
                            { label: "Advertisement" },
                            { label: "SMS" },
                            { label: "Other" },
                          ]}
                          disabled={submitLoading}
                        />

                        {feedbackFields?.discovery_method === "Other" && (
                          <label className="form-control w-full max-w-lg">
                            <div className="label">
                              <span className="label-text text-info"></span>
                            </div>
                            <input
                              type="text"
                              name="discovery_text"
                              value={feedbackFields.discovery_text}
                              onChange={handleChangeValue}
                              placeholder="Please state..."
                              className="input input-bordered input-primary w-full"
                              disabled={submitLoading}
                            />
                          </label>
                        )}
                      </>
                    </CustomerSurveyCard>

                    <CustomerSurveyCard elavate>
                      <div className="flex flex-col gap-2">
                        <h6 className="text-xl font-bold text-bold text-primary inline-flex gap-2 items-center">
                          <AiFillLike className="opacity-50" />
                          Dining satisfaction survey
                        </h6>
                        <div className="h-[2px] w-full bg-primary" />
                      </div>
                      <RadioGroup
                        fullWidth
                        label="Would you visit this restaurant again?"
                        name="will_visit_again"
                        value={feedbackFields.will_visit_again || ""}
                        onChange={handleChangeValue}
                        direction="flex-col"
                        items={[{ label: "Yes" }, { label: "No" }]}
                        disabled={submitLoading}
                      />

                      <RadioGroup
                        fullWidth
                        label="Did the manager/supervisor visit your table?"
                        name="manager_visit"
                        value={feedbackFields.manager_visit || ""}
                        onChange={handleChangeValue}
                        direction="flex-col"
                        items={[{ label: "Yes" }, { label: "No" }]}
                        disabled={submitLoading}
                      />
                    </CustomerSurveyCard>

                    <CustomerSurveyCard animate elavate>
                      <div className="flex flex-col gap-2">
                        <h6 className="text-xl font-bold text-bold text-primary inline-flex gap-2 items-center">
                          <MdFoodBank className="opacity-50 text-3xl" />
                          Favorite restaurant?
                        </h6>
                        <div className="h-[2px] w-full bg-primary" />
                      </div>

                      {/* <label className="form-control w-full max-w-lg">
                        <div className="label">
                          <span className="label-text text-info"></span>
                        </div>
                        <input
                          type="text"
                          name="favorite_restaurant"
                          value={feedbackFields.favorite_restaurant}
                          onChange={handleChangeValue}
                          placeholder="Restaurant name..."
                          className="input input-bordered input-primary w-full"
                          disabled={submitLoading}
                        />
                      </label> */}

                      <select
                        name="favorite_restaurant"
                        value={feedbackFields.favorite_restaurant}
                        onChange={(e) =>
                          setFeedbackFields((prevState) => ({
                            ...prevState,
                            [e.target.name]: e.target.value,
                          }))
                        }
                        className="select select-bordered select-md input-primary w-full"
                        disabled={submitLoading}
                      >
                        {content.en.restaurants.map((c, index) => {
                          return (
                            <option
                              key={"favorite_restaurant_" + index}
                              disabled={index === 0}
                              value={c}
                            >
                              {c}
                            </option>
                          );
                        })}
                      </select>
                    </CustomerSurveyCard>

                    <CustomerSurveyCard animate elavate>
                      {/* Comments*/}
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <h6 className="text-xl font-bold text-bold text-primary">
                            Any other comments?
                          </h6>
                          <div className="h-[2px] w-full bg-primary" />
                        </div>
                        <textarea
                          placeholder="Your comment"
                          name="additional_comments"
                          value={feedbackFields.additional_comments}
                          onChange={handleChangeValue}
                          className="textarea textarea-bordered w-full h-48"
                          disabled={submitLoading}
                        />
                      </div>
                    </CustomerSurveyCard>

                    <CustomerSurveyCard animate elavate>
                      {/* Customer info pt.1*/}
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                          <h6 className="text-xl font-bold text-bold text-primary inline-flex gap-2 items-center">
                            <IoPerson className="opacity-50 text-2xl" />
                            Customer information
                          </h6>
                          <div className="h-[2px] w-full bg-primary" />
                        </div>
                        <label className="form-control w-full max-w-lg">
                          <div className="label">
                            <span className="label-text text-info">Full name</span>
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={feedbackFields.name}
                            onChange={handleChangeValue}
                            placeholder="Enter here..."
                            className="input input-bordered input-primary w-full"
                            disabled={submitLoading}
                          />
                        </label>

                        <label className="form-control w-full max-w-lg">
                          <div className="label">
                            <span className="label-text text-info">
                              Phone number
                            </span>
                          </div>
                          <input
                            type="text"
                            name="telephone_number"
                            value={feedbackFields.telephone_number}
                            onChange={handleChangeValue}
                            placeholder="97400000000 or 00000000"
                            className="input input-bordered input-primary w-full"
                            disabled={submitLoading}
                          />
                        </label>

                        <label className="form-control w-full max-w-lg">
                          <div className="label">
                            <span className="label-text text-info">Birth date</span>
                          </div>
                          <input
                            type="date"
                            max="9999-12-13"
                            name="birth_date"
                            value={
                              feedbackFields?.birth_date || ""
                                ? moment(feedbackFields?.birth_date).format(
                                    "yyyy-MM-DD",
                                  )
                                : ""
                            }
                            onChange={handleChangeValue}
                            placeholder="Enter here..."
                            className="input input-bordered input-primary w-full"
                            disabled={submitLoading}
                          />
                        </label>

                        <label className="form-control w-full max-w-lg">
                          <div className="label">
                            <span className="label-text text-info">
                              Email address
                            </span>
                          </div>
                          <input
                            type="email"
                            name="email_address"
                            value={feedbackFields?.email_address || ""}
                            onChange={handleChangeValue}
                            placeholder="customer@email.com"
                            className="input input-bordered input-primary w-full"
                            disabled={submitLoading}
                          />
                        </label>
                      </div>
                    </CustomerSurveyCard>
                  </>
                )}
                {/* When did you visit? */}

                <CustomerSurveyCard animate elavate>
                  <div className="flex flex-col gap-6">
                    <h6 className="text-xl font-bold text-bold text-gray-700 inline-flex gap-4 items-center">
                      😊 How Did We Do Today?
                    </h6>
                    <div className="h-[4px] w-full bg-primary rounded-lg" />
                  </div>
                  {/* <div className="flex flex-row max-md:flex-col-reverse justify-center items-center gap-8 bg-gray-100 py-4 px-2 rounded-sm box-content">
                    {content.en.customer_rating.map((d, index) => {
                      return (
                        <button
                          key={d.value + "-" + index}
                          type="button"
                          className={`btn btn-lg box-content py-4 px-4 max-w-full max-md:btn-block max-md:px-0 max-md:py-2 min-w-32 ${
                            feedbackFields.customer_feedback === d.value
                              ? "btn-active"
                              : ""
                          } ${d.value === "detractor" ? "btn-error" : ""} ${
                            d.value === "neutral" ? "btn-warning" : ""
                          } ${d.value === "promoter" ? "btn-primary" : ""}`}
                          onClick={() =>
                            setFeedbackFields((prevState) => ({
                              ...prevState,
                              customer_feedback: d.value,
                            }))
                          }
                        >
                          <span
                            className={`${
                              feedbackFields.customer_feedback === d.value
                                ? "text-6xl max-md:text-4xl"
                                : "text-4xl max-md:text-2xl"
                            }`}
                          >
                            {d.icon}
                          </span>
                          <span
                            className={`text-md max-md:text-sm ${
                              feedbackFields.customer_feedback === d.value
                                ? "font-bold"
                                : "font-normal"
                            }`}
                          >
                            {d.label}
                          </span>
                        </button>
                      );
                    })}
                  </div> */}
                  <div className="flex flex-col justify-center items-start gap-4 bg-gray-100 py-4 px-2 rounded-md box-content">
                    <span className="text-info text-md">Please rate us.</span>
                    <input
                      type="range"
                      min={0}
                      max="10"
                      name="customer_feedback_number"
                      value={feedbackFields.customer_feedback_number || 0}
                      onChange={handleChangeValue}
                      className={`range ${
                        feedbackFields.customer_feedback === "detractor"
                          ? "range-error"
                          : ""
                      }
                      ${
                        feedbackFields.customer_feedback === "neutral"
                          ? "range-warning"
                          : ""
                      }
                      ${
                        feedbackFields.customer_feedback === "promoter"
                          ? "range-primary"
                          : ""
                      }
                      transition-all ease-in-out `}
                    />
                  </div>

                  <div className="flex flex-col justify-center items-center gap-2  py-2 px-2 rounded-sm box-content">
                    {content.en.customer_rating
                      .filter(
                        (rating) =>
                          rating.value === feedbackFields.customer_feedback,
                      )
                      .map((d, index) => {
                        return (
                          <Fragment key={"nps_" + index}>
                            <span
                              className={`${
                                feedbackFields.customer_feedback === d.value
                                  ? "text-6xl max-md:text-4xl"
                                  : "text-4xl max-md:text-2xl"
                              }`}
                            >
                              {d.icon}
                            </span>
                            <span
                              className={`text-md max-md:text-sm ${
                                feedbackFields.customer_feedback === d.value
                                  ? "font-bold"
                                  : "font-normal"
                              }`}
                            >
                              {d.label}
                            </span>
                          </Fragment>
                        );
                      })}
                  </div>

                  <textarea
                    className="textarea textarea-lg"
                    placeholder="Your comments?"
                    name="customer_comments"
                    value={feedbackFields.customer_comments || ""}
                    onChange={handleChangeValue}
                  />
                </CustomerSurveyCard>

                <div className="flex flex-col gap-2 items-center justify-center w-full">
                  {!isRetailTransaction && (
                    <label className="form-control w-full max-w-full flex-row items-center gap-2">
                      <input
                        type="checkbox"
                        name={`marketing_consent`}
                        className="checkbox checkbox-primary"
                        checked={feedbackFields.marketing_consent || false}
                        onChange={handleChangeValue}
                      />
                      <div className="label">
                        <span className="label-text text-info">
                          Would you allow us to contact you for any future
                          promotions, events and informations about our restaurants?
                        </span>
                      </div>
                    </label>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-full text-white shadow-lg"
                    disabled={submitLoading}
                  >
                    Submit&nbsp;{}
                    <span
                      className={`loading loading-spinner loading-md ${
                        !submitLoading ? "hidden" : ""
                      }`}
                    />
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </>
  );
};

interface CustomerSurveyProps {
  type: "fnb" | "retail";
}

export default CustomerSurvey;
