import React, { useState } from "react";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import axios from "axios";

export const EmployeeQuestionEmailSender = () => {
  const [emails, setEmails] = useState("");
  const [errors, setErrors] = useState<string[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const config = useConfig();

  const handleSubmit = async () => {
    if (emails) {
      await sendMail();
    }
  };

  const sendMail = async () => {
    const emailsArray = emails.split(`\n`);
    setErrors(undefined);
    setLoading(true);
    setSubmitted(false);
    const email = emailsArray[0];

    for (let index = 0; index <= emailsArray.length; index++) {
      const email = emailsArray[index];
      if (email) {
        try {
          await axios({
            method: "post",
            url: `${config.routes.api}/email/send`,
            data: { email: email },
          });
        } catch (error) {
          const message = `${email}: Check if email is existing. ${
            error.message ? "Error: " + error.message : ""
          }`;
          setErrors((prevState) =>
            prevState ? [...prevState, message] : [message],
          );
        }
      }
    }

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="gutter--left gutter--right collection-list__wrap">
      <div className="flex flex-col max-w-md gap-4">
        <div className="flex flex-col max-w-md gap-2"></div>
        <p className="p-0 m-0 text-sm">Email are separated by new line</p>
        <p className="p-0 m-0 text-sm">Ex:</p>
        <p className="p-0 m-0 text-sm italic">
          email@email.com
          <br />
          test@email.com
          <br />
          test@email.com
        </p>
        <textarea
          disabled={loading}
          rows={16}
          placeholder="List of email(s)"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
        ></textarea>
        <button onClick={handleSubmit} disabled={loading} className="py-4">
          Send
        </button>
        {!errors && submitted && (
          <p className="p-0 m-0 text-sm text-green-400">Submitted</p>
        )}
        {errors && (
          <>
            <p className="p-0 m-0 text-sm text-red-500">Errors</p>
            <textarea
              rows={16}
              placeholder="Errors will be displayed here"
              value={errors.join("\n")}
              readOnly
            ></textarea>
          </>
        )}
      </div>
    </div>
  );
};
