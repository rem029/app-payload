import { IoMdAdd, IoMdPerson, IoMdRemoveCircleOutline } from "react-icons/io";
import { API_SURVEY_URL } from "../../../utils/constants";
import { FaCheck, FaChild, FaRegIdCard, FaSignature } from "react-icons/fa";
import Signature from "signature_pad";
import { FaPerson, FaPhone } from "react-icons/fa6";
import { LuDot } from "react-icons/lu";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useAxios } from "../../../hooks/use-axios";
import { RxReset } from "react-icons/rx";
import { IflyWaiverForm, IflyWaiverFormDependent, Item } from "../../../types";
import { axiosPayloadClient } from "../../../utils/config";
import { AxiosError } from "axios";
import ErrorMessage from "../../common/error-message";
import SuccessMessageForm from "../success-message";
import SignaturePad from "signature_pad";
import { addClassToSvgString } from "../../../helpers";
import { useNavigate, useSearchParams } from "react-router-dom";

const defaultDependent: IflyWaiverFormDependent = { name: "", qid: "", phone: "" };

const defaultFields: IflyWaiverForm = {
  name: "",
  phone: "",
  qid: "",
  dependents: [defaultDependent],
  signature_svg: "",
};

const urlBaseItem = "/api/items?limit=10000&where[name][equals]";

const IFlyWaiver = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [fields, setFields] = useState<IflyWaiverForm>(defaultFields);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [formError, setFormError] = useState("");
  const [formResponse, setFormResponse] = useState("");
  const [formResponseDoc, setFormResponseDoc] = useState<IflyWaiverForm>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  let signaturePad: SignaturePad | null = null;

  const {
    data: dataNote,
    error: errorNote,
    loading: loadingNote,
  } = useAxios<any>({
    config: {
      method: "get",
      url: `${urlBaseItem}=dohaquest-ifly-waiver-note`,
    },
    fetchOnLoad: true,
  });

  const {
    data: dataChecklist,
    error: errorChecklist,
    loading: loadingChecklist,
  } = useAxios<any>({
    config: {
      method: "get",
      url: `${urlBaseItem}=dohaquest-ifly-waiver-checklist`,
    },
    fetchOnLoad: true,
  });

  const {
    data: dataTerms,
    error: errorTerms,
    loading: loadingTerms,
  } = useAxios<any>({
    config: {
      method: "get",
      url: `${urlBaseItem}=dohaquest-ifly-waiver-terms`,
    },
    fetchOnLoad: true,
  });

  const notes: Item | undefined = useMemo(() => {
    if (!dataNote && !dataNote?.docs) return undefined;
    return dataNote.docs[0] as Item;
  }, [dataNote]);

  const checklist: Item | undefined = useMemo(() => {
    if (!dataChecklist && !dataChecklist?.docs) return undefined;
    return dataChecklist.docs[0] as Item;
  }, [dataChecklist]);

  const terms: Item | undefined = useMemo(() => {
    if (!dataTerms && !dataTerms?.docs) return undefined;
    return dataTerms.docs[0] as Item;
  }, [dataTerms]);

  useEffect(() => {
    if (errorNote) {
      setFormError(errorNote.message);
    }

    if (errorChecklist) {
      setFormError(errorChecklist.message);
    }

    if (errorTerms) {
      setFormError(errorTerms.message);
    }
  }, [errorNote, errorChecklist, errorTerms]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  useEffect(() => {
    readyPad();
    if (searchParams.get("id")) {
      fetchIflyWaiverForm();
    }

    return () => {
      if (signaturePad) {
        signaturePad.off();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (language === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [language]);

  const readyPad = () => {
    if (canvasRef.current) {
      canvasRef.current.getContext("2d")?.scale(1, 1);
      signaturePad = new Signature(canvasRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0)",
        penColor: "black",
      });

      window.addEventListener("resize", resizeCanvas);
      signaturePad.addEventListener("endStroke", handleSignatureEndStroke);

      resizeCanvas();
    }
  };

  const fetchIflyWaiverForm = async () => {
    setLoadingSubmit(true);
    const id = searchParams.get("id");
    if (!id) return;

    try {
      const response = await axiosPayloadClient.get(`/api/ifly-waiver-forms/${id}`);

      if (response.status !== 200 && response.status !== 201) {
        throw new AxiosError(
          "Something went wrong while submitting. Please contact administrator.",
        );
      }

      setFormResponse("iFly Waiver form has been submitted");
      setFormResponseDoc(response.data || undefined);
      setStep("success");
    } catch (error) {
      setFormError((error as AxiosError).message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const resizeCanvas = () => {
    if (canvasRef.current) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
      canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
      canvasRef?.current?.getContext("2d")?.scale(ratio, ratio);
      signaturePad?.clear();
    }
  };

  const handleSignatureEndStroke = () => {
    const svg = signaturePad?.toSVG({ includeBackgroundColor: false }) || "";
    setFields((prevState) => ({ ...prevState, signature_svg: svg }));
  };

  const handleClickAddDependent = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setFields((prevState) => ({
      ...prevState,
      dependents: [...(prevState.dependents || []), defaultDependent],
    }));
  };

  const handleClickRemoveDependent = (
    e: React.FormEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.preventDefault();
    setFields((prevState) => ({
      ...prevState,
      dependents: prevState?.dependents?.filter((_, dIndex) => dIndex !== index),
    }));
  };

  const handleChangeDependentFields = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    let { name, value } = e.target;
    name = name.replaceAll("dependent_", "");

    const updatedDependent = fields.dependents?.map((dependent, dIndex) => {
      if (dIndex === index) {
        return {
          ...dependent,
          [name as keyof IflyWaiverFormDependent]: value,
        } as IflyWaiverFormDependent;
      }

      return dependent;
    });

    setFields((prevState) => ({
      ...prevState,
      dependents: updatedDependent,
    }));
  };

  const handleChangeParentFields = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClickResetSvg = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signaturePad?.clear();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      if (signaturePad?.isEmpty() || !fields.signature_svg) {
        setFormError("Signature is empty");
        return;
      }

      const hasDependents =
        fields.dependents?.length === 1 &&
        !fields.dependents[0].name &&
        !fields.dependents[0].phone &&
        !fields.dependents[0].qid;

      if (hasDependents) {
        setFields((prevState) => ({ ...prevState, dependents: undefined }));
      }

      const response = await axiosPayloadClient.post(
        "/api/ifly-waiver-forms",
        hasDependents ? { ...fields, dependents: undefined } : fields,
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new AxiosError(
          "Something went wrong while submitting. Please contact administrator.",
        );
      }
      setFormResponse(response.data?.message || "");
      setFormResponseDoc(response.data?.doc || undefined);
      navigate(`/dohaquest/ifly-waiver?id=${response.data?.doc?.id}`);
      setStep("success");
    } catch (error) {
      setFormError((error as AxiosError).message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const waiverListContainerChecklist = () => {
    return (
      <WaiverListContainer>
        <p className="text-gray-900  text-md font-semibold">Checklists</p>
        <ul className="w-full flex flex-col gap-4">
          {loadingChecklist && (
            <span className="loading loading-dots loading-lg text-primary"></span>
          )}
          {!loadingChecklist &&
            checklist?.items &&
            checklist.items.map((item) => {
              const label = item?.values
                ? item.values.find((i) => i.key === language)?.value
                : "";
              return (
                <li key={item.id} className="w-full flex flex-row gap-2 items-start">
                  <FaCheck className="text-sm text-secondary" />
                  <p className="text-gray-700 w-full text-sm">{label}</p>
                </li>
              );
            })}
        </ul>
      </WaiverListContainer>
    );
  };

  const waiverListContainerNotes = () => {
    return (
      <WaiverListContainer>
        <p className="text-gray-400 w-full text-sm">Notes</p>
        <ul className="w-full flex flex-col gap-4">
          {loadingNote && (
            <span className="loading loading-dots loading-lg text-primary"></span>
          )}
          {!loadingNote &&
            notes?.items &&
            notes.items.map((item) => {
              const label = item?.values
                ? item.values.find((i) => i.key === language)?.value
                : "";
              return (
                <li key={item.id} className="w-full flex flex-row gap-2 items-start">
                  <p className="text-gray-700 w-full text-sm leading-loose">
                    {label}
                  </p>
                </li>
              );
            })}
        </ul>
      </WaiverListContainer>
    );
  };

  const waiverListContainerTerms = () => {
    return (
      <WaiverListContainer>
        <p className="text-gray-900 w-full text-md font-semibold">
          Terms and conditions
        </p>
        <ul className="w-full flex flex-col gap-4">
          {loadingTerms && (
            <span className="loading loading-dots loading-lg text-primary"></span>
          )}
          {!loadingTerms &&
            terms?.items &&
            terms.items.map((item) => {
              const label = item?.values
                ? item.values.find((i) => i.key === language)?.value
                : "";
              return (
                <li key={item.id} className="w-full flex flex-row gap-1 items-start">
                  <LuDot className="text-4xl text-secondary" />
                  <p className="text-gray-700 w-full text-sm leading-loose">
                    {label}
                  </p>
                </li>
              );
            })}
        </ul>
      </WaiverListContainer>
    );
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center gap-4 p-0 px-1 pb-8 max-md:px-4">
      <div className="w-full max-w-3xl p-0 gap-8">
        <HeaderiFly />
        <ErrorMessage message={formError} onClose={() => setFormError("")} />
        <div className="join">
          <button
            className={`btn btn-xs join-item ${
              language === "en" ? "btn-primary" : "btn-info btn-outline"
            }`}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>

          <button
            className={`btn btn-xs join-item ${
              language === "ar" ? "btn-primary" : "btn-info btn-outline"
            }`}
            onClick={() => setLanguage("ar")}
          >
            AR
          </button>
        </div>
        {step === "success" && (
          <div className="w-full flex flex-col items-center p-0 overflow-y-auto gap-10 py-4">
            <SuccessMessageForm
              title={formResponse}
              subtitle={"Thank you! Your Form ID is: " + formResponseDoc?.id}
            />

            {waiverListContainerChecklist()}
            {waiverListContainerNotes()}
            {waiverListContainerTerms()}

            <WaiverFormContainer>
              <div className="w-full flex flex-row gap-4 items-center">
                <FaPerson className="text-gray-300 text-md" />
                <p className="text-md font-bold uppercase text-gray-500">
                  Your information
                </p>
              </div>

              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-row gap-4 items-center">
                  <IoMdPerson className="text-gray-300 text-md" />
                  <p className="text-sm text-gray-400">Name</p>
                </div>
                <p className="text-sm text-gray-800">{formResponseDoc?.name}</p>
              </div>

              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-row gap-4 items-center">
                  <FaRegIdCard className="text-gray-300 text-md" />
                  <p className="text-sm text-gray-400">QID / Passport#</p>
                </div>
                <p className="text-sm text-gray-800">{formResponseDoc?.qid}</p>
              </div>

              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-row gap-4 items-center">
                  <FaPhone className="text-gray-300 text-md" />
                  <p className="text-sm text-gray-400">Phone</p>
                </div>
                <p className="text-sm text-gray-800">{formResponseDoc?.phone}</p>
              </div>
            </WaiverFormContainer>

            <div className="divider"></div>

            {formResponseDoc?.dependents &&
              formResponseDoc.dependents.length > 0 && (
                <WaiverFormContainer>
                  <div className="w-full flex flex-row gap-4 items-center">
                    <FaChild className="text-gray-300 text-md" />
                    <p className="text-md font-bold uppercase text-gray-500">
                      Dependents / Children
                    </p>
                  </div>

                  <div className="w-full flex flex-col gap-4 items-center">
                    {formResponseDoc.dependents.map((dependent, index) => {
                      return (
                        <>
                          {index > 0 && <div className="divider"></div>}
                          <div className="w-full flex flex-col gap-2">
                            <div className="w-full flex flex-row gap-4 items-center">
                              <IoMdPerson className="text-gray-300 text-md" />
                              <p className="text-sm text-gray-400">Name</p>
                            </div>
                            <p className="text-sm text-gray-800">{dependent.name}</p>
                          </div>
                          <div className="w-full flex flex-col gap-2">
                            <div className="w-full flex flex-row gap-4 items-center">
                              <FaRegIdCard className="text-gray-300 text-md" />
                              <p className="text-sm text-gray-400">
                                QID / Passport#
                              </p>
                            </div>
                            <p className="text-sm text-gray-800">{dependent.qid}</p>
                          </div>
                          <div className="w-full flex flex-col gap-2">
                            <div className="w-full flex flex-row gap-4 items-center">
                              <FaPhone className="text-gray-300 text-md" />
                              <p className="text-sm text-gray-400">Phone</p>
                            </div>
                            <p className="text-sm text-gray-800">
                              {dependent.phone}
                            </p>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </WaiverFormContainer>
              )}

            <div className="divider"></div>

            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-row gap-4 items-center">
                <FaSignature className="text-sm text-gray-400" />
                <p className="text-sm text-gray-400">Signature</p>
              </div>
              <div
                className="w-full h-80 border-2 rounded-md"
                dangerouslySetInnerHTML={{
                  __html: addClassToSvgString(
                    formResponseDoc?.signature_svg || "",
                    "w-full",
                  ),
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
      {step === "form" && (
        <div className="w-full h-full p-0 flex flex-col items-center overflow-y-auto">
          <div className="w-full max-w-2xl h-full flex flex-col p-0 gap-8">
            <h6 className="w-full text-primary text-md uppercase font-bold min-w-fit">
              iFly Waiver of liability
            </h6>

            {waiverListContainerChecklist()}
            {waiverListContainerNotes()}
            {waiverListContainerTerms()}

            <div className="divider"></div>
            <form
              className="w-full py-2 px-1 flex flex-col gap-16"
              onSubmit={handleSubmit}
            >
              <WaiverFormContainer>
                <div className="w-full flex flex-row gap-4 items-center">
                  <FaPerson className="text-gray-300 text-md" />
                  <p className="text-md font-bold uppercase text-gray-500">
                    Your information
                  </p>
                </div>

                <label className="form-control w-full">
                  <label className="input  flex items-center gap-2">
                    <input
                      type="text"
                      required
                      className="grow"
                      placeholder="Name"
                      name="name"
                      value={fields.name}
                      onChange={handleChangeParentFields}
                      disabled={loadingSubmit}
                    />
                    <IoMdPerson className="text-gray-400" />
                  </label>

                  <div className="label">
                    <span className="label-text-alt uppercase text-gray-400">
                      Participant of parent/guardian
                    </span>
                  </div>
                </label>

                <label className="form-control w-full">
                  <label className="input  flex items-center gap-2">
                    <input
                      type="tel"
                      required
                      className="grow"
                      placeholder="QID/Passport#"
                      name="qid"
                      minLength={8}
                      maxLength={13}
                      value={fields.qid}
                      onChange={handleChangeParentFields}
                      disabled={loadingSubmit}
                    />
                    <FaRegIdCard className="text-gray-400" />
                  </label>

                  <div className="label">
                    <span className="label-text-alt uppercase text-gray-400">
                      Your residence permit ID or passport number.
                    </span>
                  </div>
                </label>

                <label className="form-control w-full">
                  <label className="input  flex items-center gap-2">
                    <input
                      type="tel"
                      pattern="\d*"
                      required
                      className="grow"
                      placeholder="Phone#"
                      name="phone"
                      value={fields.phone}
                      onChange={handleChangeParentFields}
                      disabled={loadingSubmit}
                    />
                    <FaPhone className="text-gray-400" />
                  </label>

                  <div className="label">
                    <span className="label-text-alt uppercase text-gray-400">
                      ex. 0097411222211, 97411222211 or 11223344
                    </span>
                  </div>
                </label>
              </WaiverFormContainer>

              <WaiverFormContainer>
                <div className="w-full flex flex-row gap-4 items-center">
                  <FaChild className="text-gray-300 text-md" />
                  <p className="text-md font-bold uppercase text-gray-500">
                    Dependents / Children
                  </p>
                </div>

                <>
                  {fields?.dependents &&
                    fields?.dependents?.map((dependent, index) => {
                      return (
                        <Fragment key={"dependent_" + index}>
                          {index > 0 && (
                            <>
                              <div className="divider"></div>
                              <div className="w-full flex flex-row justify-end">
                                <button
                                  className="btn btn-info btn-outline btn-xs max-w-xs"
                                  onClick={(e) =>
                                    handleClickRemoveDependent(e, index)
                                  }
                                  disabled={loadingSubmit}
                                >
                                  <IoMdRemoveCircleOutline />
                                  Remove Dependents / Child
                                </button>
                              </div>
                            </>
                          )}

                          <label className="form-control w-full">
                            <label className="input  flex items-center gap-2">
                              <input
                                type="text"
                                className="grow"
                                placeholder="Name"
                                name="dependent_name"
                                value={dependent.name}
                                disabled={loadingSubmit}
                                onChange={(e) =>
                                  handleChangeDependentFields(e, index)
                                }
                              />
                              <IoMdPerson className="text-gray-400" />
                            </label>

                            <div className="label">
                              <span className="label-text-alt uppercase text-gray-400">
                                Child's name
                              </span>
                            </div>
                          </label>

                          <label className="form-control w-full">
                            <label className="input flex items-center gap-2">
                              <input
                                type="tel"
                                required={dependent.name.length > 0}
                                className="grow"
                                placeholder="QID/Passport#"
                                name="dependent_qid"
                                minLength={8}
                                maxLength={13}
                                value={dependent.qid}
                                disabled={loadingSubmit}
                                onChange={(e) =>
                                  handleChangeDependentFields(e, index)
                                }
                              />
                              <FaRegIdCard className="text-gray-400" />
                            </label>

                            <div className="label">
                              <span className="label-text-alt uppercase text-gray-400">
                                Child's residence permit ID or passport number.
                              </span>
                            </div>
                          </label>

                          <label className="form-control w-full">
                            <label className="input  flex items-center gap-2">
                              <input
                                type="tel"
                                pattern="\d*"
                                className="grow"
                                placeholder="Phone#"
                                name="dependent_phone"
                                value={dependent?.phone || ""}
                                disabled={loadingSubmit}
                                onChange={(e) =>
                                  handleChangeDependentFields(e, index)
                                }
                              />
                              <FaPhone className="text-gray-400" />
                            </label>

                            <div className="label">
                              <span className="label-text-alt uppercase text-gray-400">
                                ex. 0097411222211, 97411222211 or 11223344
                              </span>
                            </div>
                          </label>
                        </Fragment>
                      );
                    })}
                </>

                <div className="divider"></div>

                <button
                  className="btn btn-info btn-outline btn-sm"
                  onClick={handleClickAddDependent}
                  disabled={loadingSubmit}
                >
                  <IoMdAdd />
                  Add Dependents / Child
                </button>
              </WaiverFormContainer>

              <WaiverFormContainer>
                <div className="divider py-1">
                  <FaSignature className="text-gray-400 text-6xl" />
                  <p className="label-text-alt uppercase text-gray-400">Signature</p>
                </div>

                <div
                  className={`w-full h-80 border-2 rounded-md ${
                    loadingSubmit ? "pointer-events-none" : "pointer-events-auto"
                  }`}
                >
                  <canvas
                    ref={canvasRef}
                    className="signature-canvas w-full h-full"
                  ></canvas>
                </div>

                <button
                  className="btn btn-info btn-xs btn-outline"
                  onClick={handleClickResetSvg}
                  disabled={loadingSubmit}
                >
                  Reset
                  <RxReset />
                </button>
              </WaiverFormContainer>

              <p className="text-xs text-center text-gray-400">
                By submitting this form means you comply and understand above listed
                checklist, terms and conditions
              </p>

              <button
                className="btn btn-primary btn-md"
                type="submit"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const HeaderiFly = () => {
  return (
    <header className="w-full py-4 flex flex-row items-center justify-between max-md:py-1">
      <img
        src={`${API_SURVEY_URL}/media//quest-logo-header.png`}
        alt="quest-logo-header.png"
        className="w-24 h-auto object-contain flex max-md:w-16"
      />

      <img
        src={`${API_SURVEY_URL}/media//ifly-logo-header.png`}
        alt="ifly-logo-header.png"
        className="w-24 h-auto object-contain flex max-md:w-16"
      />
    </header>
  );
};

const WaiverListContainer = ({ children }: iFlyWaiverDefaultProps) => {
  return <div className="w-full flex flex-col gap-4">{children}</div>;
};

const WaiverFormContainer = ({ children }: iFlyWaiverDefaultProps) => {
  return <div className="w-full flex flex-col gap-4">{children}</div>;
};

type Language = "en" | "ar";

interface iFlyWaiverDefaultProps {
  children: JSX.Element | JSX.Element[];
}

export default IFlyWaiver;
