import React, { useEffect, useMemo, useState } from "react";
import { DefaultTemplate } from "payload/components/templates";
import payload from "payload";
import { AdminViewProps } from "payload/config";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import usePayloadAPI from "payload/dist/admin/hooks/usePayloadAPI";
import { Redirect } from "react-router-dom";
import { HealthCheck } from "payload/generated-types";
import axios, { AxiosError } from "axios";
import { HealthCheckStatusItem } from "./item";

export const HealthCheckStatus = ({ user, canAccessAdmin }: AdminViewProps) => {
  const {
    routes: { admin: adminRoute, api: apiRoute },
    serverURL,
  } = useConfig();

  const [{ data, isError, isLoading }] = usePayloadAPI(
    `${serverURL}${apiRoute}/health-check`,
    {
      initialParams: {
        limit: 100000,
      },
    },
  );

  const healthChecks: HealthCheck[] = useMemo(() => {
    if (!isLoading && !isError && data) return data.docs;

    return [];
  }, [data, isError, isLoading]);

  useEffect(() => {
    console.log("@HealthCheckStatus.healthChecks", healthChecks);
    console.log("@HealthCheckStatus.isError", isError);
    console.log("@HealthCheckStatus.isLoading", isLoading);
  }, [healthChecks, isError, isLoading]);

  if (!user || (user && !canAccessAdmin)) {
    return <Redirect to={`${adminRoute}/unauthorized`} />;
  }

  return (
    <DefaultTemplate>
      <div className="m-8 p-1">
        <h1>Hello fom health check</h1>
        {healthChecks.map((hc) => (
          <HealthCheckStatusItem item={hc} key={hc.id} />
        ))}
      </div>
    </DefaultTemplate>
  );
};
