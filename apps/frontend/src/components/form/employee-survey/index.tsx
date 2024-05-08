import React, { useEffect, useMemo, useState } from "react";
import CustomerSurveyCard from "../../common/card";
import {
  EmployeeRatingOptions,
  ContentHeader,
  ContentInfo,
  EmployeeQuestion,
  EmployeeQuestionItem,
  EmployeeResponse,
  Departments,
} from "../../../types";
import Rating from "../../common/rating";
import { serializeRichText } from "../../../helpers";
import { CiGlobe } from "react-icons/ci";
import { FaInfoCircle } from "react-icons/fa";
import { useSearchParams, useNavigate } from "react-router-dom";
import SuccessMessageForm from "../success-message";
import ErrorMessage from "../../common/error-message";
import { axiosPayloadClient } from "../../../utils/config";

const EmployeeSurvey = (): JSX.Element => {
  const [feedbackFields, setFeedbackFields] =
    useState<EmployeeResponse>(defaultFields);
  const [step, setStep] = useState<
    "enter-employee-id" | "enter-employee-info" | "enter-employee-done"
  >("enter-employee-id");
  const [departments, setDepartments] = useState<Departments[] | undefined>(
    undefined,
  );
  const [formError, setFormError] = useState("");
  const [language, setLanguage] = useState("en");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [content, setContent] = useState<
    | {
        header: ContentHeader[];
        info: ContentInfo[];
      }
    | undefined
  >();
  const [employeeQuestions, setEmployeeQuestions] = useState<
    EmployeeQuestion[] | undefined
  >();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const headerName = useMemo(() => {
    if (!content || !content?.header || content?.header.length === 0) return "";
    const matchingContent = content?.header.find(
      (c) => c.language === language,
    )?.content;
    const fallbackContent = content?.header[0]?.content || [];
    const finalContent = matchingContent || fallbackContent;

    return finalContent;
  }, [content, language]);

  const infoText = useMemo(() => {
    if (!content || !content.info || content.info.length === 0) return [];

    const matchingContent = content.info.find(
      (c) => c.language === language,
    )?.content;

    const fallbackContent = content.info[0]?.content || [];
    const finalContent = matchingContent || fallbackContent;
    return finalContent.map((item) => serializeRichText(item));
  }, [content, language]);

  const subDepartment = useMemo(() => {
    if (!departments && !feedbackFields.department) return [];

    return departments?.find((d) => d.name === feedbackFields.department)
      ?.department_subs;
  }, [departments, feedbackFields.department]);

  const filteredEmployeeQuestions = useMemo<EmployeeQuestionItem[]>(() => {
    if (!employeeQuestions || employeeQuestions.length === 0) return [];

    return employeeQuestions.map((_eq) => {
      const fallbackContent: EmployeeQuestionItem = {
        id: _eq.id,
        language: "en",
        type: "text",
        title: _eq.default_title,
        subtitle: _eq.default_subtitle,
      };

      const matchingContent: EmployeeQuestionItem | undefined = _eq.item.find(
        (eq) => eq.language === language,
      );
      const finalContent: EmployeeQuestionItem = matchingContent
        ? { ...matchingContent, id: _eq.id }
        : fallbackContent;

      return finalContent;
    });
  }, [employeeQuestions, language]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setContent(undefined);
        const response = await axiosPayloadClient.get(`/api/contents?limit=100000`);

        if (response.status !== 200 || !response.data.docs) {
          setFormError("Error fetching contents. Please contact IT.");
        }
        const docs = response.data.docs[0];
        const docsHeaders = docs["header"];
        const docsInfo = docs["info"];

        setContent({
          header: docsHeaders as ContentHeader[],
          info: docsInfo as ContentInfo[],
        });
      } catch (error) {
        setFormError(
          (error as Error)?.message || "Unknown error. Please contact IT.",
        );
      }
    };

    const fetchQuestions = async () => {
      try {
        setEmployeeQuestions(undefined);
        const response = await axiosPayloadClient.get(
          `/api/employee-questions?sort=id&limit=100000`,
        );

        if (response.status !== 200 || !response.data.docs) {
          setFormError("Error fetching questions. Please contact IT.");
        }
        const docs = response.data.docs;

        setEmployeeQuestions(docs);
      } catch (error) {
        setFormError(
          (error as Error)?.message || "Unknown error. Please contact IT.",
        );
      }
    };

    const fetchDepartments = async () => {
      try {
        setDepartments(undefined);
        const response = await axiosPayloadClient.get(
          `/api/department?limit=100000&sort=name`,
        );

        if (response.status !== 200 || !response.data.docs) {
          setFormError("Error fetching department list. Please contact IT.");
        }
        const docs = response.data.docs;
        setDepartments(docs);
      } catch (error) {
        setFormError(
          (error as Error)?.message || "Unknown error. Please contact IT.",
        );
      }
    };

    setContentLoading(true);
    Promise.all([fetchContents(), fetchQuestions(), fetchDepartments()]).finally(
      () => {
        setContentLoading(false);
      },
    );

    if (searchParams.get("id")) checkAnonymousId();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchParams.get("id")) setStep("enter-employee-id");
    else {
      setFeedbackFields((prevState) => ({
        ...prevState,
        anonymousId: Number(searchParams.get("id")) || undefined,
      }));
      setStep("enter-employee-info");
      checkAnonymousId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("id"), searchParams]);

  useEffect(() => {
    if (language === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [language]);

  useEffect(() => {
    setFeedbackFields((prevState) => ({ ...prevState, department_sub: "" }));
  }, [feedbackFields.department]);

  const checkAnonymousId = async () => {
    try {
      setContentLoading(true);
      const response = await axiosPayloadClient.get(
        `/api/employee-responses/find/${searchParams.get("id")}`,
      );

      if (response.status !== 200) {
        setFormError("Error validating survey ID. Please contact IT.");
      }
      const { docs } = response.data;
      const hasDocs = docs !== undefined && docs.length > 0 ? true : false;

      if (hasDocs) {
        setStep("enter-employee-info");
        setShowSuccess(true);
      }
    } catch (error) {
      setFormError((error as Error)?.message || "Unknown error. Please contact IT.");
    } finally {
      setContentLoading(false);
    }
  };

  const handleChangeValue = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    let { value, name } = e.target;
    if (name.includes("employee_question")) {
      const valueSplit = name.split(":");
      name = valueSplit[1];
      value = getKeyByValue(Number(valueSplit[2])) || "";

      const matchedQuestionIndex = feedbackFields.questions.findIndex(
        (q) => q.question === name,
      );

      setFeedbackFields((prevState) => {
        if (matchedQuestionIndex === -1) {
          return {
            ...prevState,
            questions: [...prevState.questions, { question: name, response: value }],
          };
        }
        prevState.questions[matchedQuestionIndex].question = name;
        prevState.questions[matchedQuestionIndex].response = value;
        return {
          ...prevState,
        };
      });
    }

    setFeedbackFields((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setFormError("");
      setSubmitLoading(true);
      const convertRatingValue = (value: string) =>
        value.replaceAll(" ", "-").toLowerCase();

      if (feedbackFields.questions.length !== filteredEmployeeQuestions.length) {
        setFormError("All question(s) are mandatory.");
        return;
      }

      if (!feedbackFields.anonymousId) {
        setFormError("Survey ID is required.");
        return;
      }

      if (!feedbackFields.department) {
        setFormError("Department is required.");
        return;
      }

      const response = await axiosPayloadClient.post(`/api/employee-responses`, {
        anonymous_id: feedbackFields.anonymousId.toString(),
        department: feedbackFields.department,
        department_sub: feedbackFields.department_sub,
        questions: feedbackFields.questions.map((q) => ({
          question: Number(q.question),
          response: convertRatingValue(q.response),
        })),
        employee_comments: feedbackFields.employee_comments,
      });

      if (response.status !== 201) {
        throw Error(
          "Something went wrong while submitting your form. Please contact admin.",
        );
      }

      setLanguage("en");
      setShowSuccess(true);
    } catch (error) {
      setFormError((error as Error)?.message || "Unknown error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const getRatingNumberValue = (value: string | undefined) => {
    if (!value) return 0;
    return EmployeeRatingOptions[value] ? EmployeeRatingOptions[value] : 0;
  };

  const getKeyByValue = (value: number): string | undefined => {
    for (const [key, val] of Object.entries(EmployeeRatingOptions)) {
      if (val === value) return key;
    }

    return undefined;
  };

  return (
    <>
      {step === "enter-employee-id" && (
        <div className="w-full h-screen overflow-x-hidden overflow-y-auto  max-md:px-4 px-12 max-md:py-4 p-8 flex flex-col flex-1 items-start relative">
          <div className="card flex flex-col w-full gap-4 items-center justify-center py-4 px-4">
            <label className="form-control w-full max-w-lg">
              <div className="label">
                <span className="label-text text-primary font-bold">
                  Please enter assigned survey ID?
                </span>
              </div>
              <input
                type="text"
                name="anonymousId"
                placeholder="Survey ID"
                value={feedbackFields.anonymousId || ""}
                onChange={handleChangeValue}
                className="input input-ghost input-md input-primary w-full"
                disabled={submitLoading}
              />
            </label>
            <button
              className="btn btn-primary text-white w-full max-w-lg"
              disabled={!feedbackFields.anonymousId}
              onClick={(e) => {
                e.preventDefault();
                if (!feedbackFields.anonymousId) return;

                navigate(`/employee?id=${feedbackFields.anonymousId.toString()}`);
                setStep("enter-employee-info");
              }}
            >
              Proceed to survey
            </button>
          </div>
        </div>
      )}
      {step === "enter-employee-info" && (
        <>
          {showSuccess && <SuccessMessageForm />}
          {!showSuccess && (
            <>
              {contentLoading && (
                <div className="flex flex-col w-screen h-screen items-center justify-center">
                  <h6 className="w-full text-center text-primary text-md max-sm:text-md mb-2">
                    Loading contents...
                  </h6>
                  <span className="loading loading-dots loading-lg text-primary"></span>
                </div>
              )}
              {!contentLoading && (
                <div className="w-full h-screen overflow-x-hidden overflow-y-auto max-md:px-4 px-12 max-md:py-4 p-8 flex flex-col flex-1 items-start relative">
                  <ErrorMessage
                    message={formError}
                    onClose={() => setFormError("")}
                  />

                  <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-4 max-md:gap-6"
                  >
                    <CustomerSurveyCard animate>
                      <div className="flex flex-col items-start justify-center flex-1">
                        <label className="form-control w-full max-w-xs">
                          <div className="label">
                            <span className="label-text text-info">
                              <CiGlobe className="inline-block text-lg" />
                              Pick your language
                            </span>
                          </div>
                          <select
                            className="select select-ghost w-full max-w-xs"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                          >
                            <option value="en">English</option>
                            <option value="ar">Arabic</option>
                            <option value="fr">French</option>
                          </select>
                        </label>
                      </div>
                    </CustomerSurveyCard>
                    <h1
                      className={`w-full text-gray-700 text-xl max-sm:text-md mb-8 ${
                        language === "ar" ? "text-right" : "text-left"
                      } `}
                    >
                      {headerName}
                    </h1>
                    <h1
                      className={`w-full  text-info text-md max-sm:text-md mb-2 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      Anonymous ID: {feedbackFields.anonymousId}
                    </h1>

                    <div className="flex flex-col items-start justify-center flex-1">
                      <label className="form-control w-full max-w-xs">
                        <div className="label">
                          <span className="label-text text-info">Department</span>
                        </div>
                        <select
                          className="select select-ghost w-full max-w-xs"
                          value={
                            departments?.find(
                              (d) => d.name === feedbackFields?.department || "",
                            )?.id || ""
                          }
                          name="department"
                          onChange={(e) =>
                            setFeedbackFields((prevState) => ({
                              ...prevState,
                              department:
                                departments?.find(
                                  (d) =>
                                    d.id.toString() === e.target.value.toString(),
                                )?.name || "",
                            }))
                          }
                        >
                          <option key={`department_${-1}`} value={-1}>
                            Select a department
                          </option>
                          {departments?.map((d) => (
                            <option key={`department_${d.id}`} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="flex flex-col items-start justify-center flex-1">
                      <label className="form-control w-full max-w-xs">
                        <div className="label">
                          <span className="label-text text-info">
                            Sub-department
                          </span>
                        </div>
                        <select
                          className="select select-ghost w-full max-w-xs"
                          value={
                            subDepartment?.find(
                              (d) => d.name === feedbackFields?.department_sub || "",
                            )?.id || ""
                          }
                          name="department_sub"
                          onChange={(e) =>
                            setFeedbackFields((prevState) => ({
                              ...prevState,
                              department_sub:
                                subDepartment?.find(
                                  (d) =>
                                    d.id.toString() === e.target.value.toString(),
                                )?.name || "",
                            }))
                          }
                        >
                          <option key={`department_sub${-1}`} value={-1}>
                            Select a Sub-department
                          </option>
                          {subDepartment &&
                            subDepartment.map((d) => (
                              <option key={`department_sub_${d.id}`} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                        </select>
                      </label>
                    </div>

                    <div className="card bg-gray-200 px-3 py-3 min-w-full">
                      <div className="flex flex-col gap-2">
                        <h6 className="text-sm font-bold text-bold text-gray-400 inline-flex gap-2 items-center">
                          <FaInfoCircle className="inline-block" />
                          Information
                        </h6>
                        <div className="h-[1px] w-full bg-gray-400" />
                        <p
                          dangerouslySetInnerHTML={{
                            __html: infoText.join("<br/>"),
                          }}
                          className={`text-gray-500 text-sm leading-6`}
                        ></p>
                      </div>
                    </div>
                    {filteredEmployeeQuestions.map((questions, index) => {
                      const field = feedbackFields.questions.find((q) => {
                        return q.question.toString() === questions.id.toString();
                      });

                      return (
                        <CustomerSurveyCard key={index} animate elavate>
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                              <h6 className="text-md font-bold text-bold text-primary inline-flex gap-2 items-center">
                                {questions.id}.&nbsp;{questions.title}
                              </h6>
                              <div className="h-[2px] w-full bg-primary" />
                            </div>
                            <Rating
                              name={`employee_question:${questions.id}`}
                              count={5}
                              value={getRatingNumberValue(field?.response)}
                              valueLabel={field?.response}
                              onChange={handleChangeValue}
                              disabled={submitLoading}
                            />
                          </div>
                        </CustomerSurveyCard>
                      );
                    })}

                    <CustomerSurveyCard animate elavate>
                      {/* Comments*/}
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <h6 className="text-xl font-bold text-bold text-primary">
                            Any comments or feedback?
                          </h6>
                          <div className="h-[2px] w-full bg-primary" />
                        </div>
                        <textarea
                          placeholder="Please type here..."
                          name="employee_comments"
                          value={feedbackFields.employee_comments}
                          onChange={handleChangeValue}
                          className="textarea textarea-bordered w-full h-48"
                          disabled={submitLoading}
                        />
                      </div>
                    </CustomerSurveyCard>

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
                  </form>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default EmployeeSurvey;

const defaultFields: EmployeeResponse = {
  anonymousId: undefined,
  department: "",
  department_sub: "",
  questions: [],
  employee_comments: "",
};
