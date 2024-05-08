import axios, { AxiosError } from "axios";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import { HealthCheck } from "payload/generated-types";
import React, { useState, useEffect } from "react";

interface HealthCheckStatusItemProps {
  item: HealthCheck;
}

export const HealthCheckStatusItem = ({
  item: { id, url },
}: HealthCheckStatusItemProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<number | undefined>(undefined);
  const [text, setText] = useState<string | undefined>(undefined);
  const {
    routes: { api: apiRoutes },
  } = useConfig();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiRoutes}/health/status?url=${url}`, { withCredentials: true })
      .then((response) => {
        setCode(response.status);
        setText(response.statusText);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          setCode(error.status);
          setText(error.message);
        } else {
          setCode(500);
          setText("Error unknown");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-row gap-4 justify-between" key={id}>
      <p className="min-w-24">{url}</p>
      <div className="flex flex-row gap-4">
        <p>{loading ? "loading" : code}</p>
        <p>{loading ? "loading" : text}</p>
      </div>
    </div>
  );
};
