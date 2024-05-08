import { NavLink } from "react-router-dom";
import { useConfig } from "payload/dist/admin/components/utilities/Config";

import React from "react";

export const CustomLinks = () => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();

  return (
    <div className="after-nav-links">
      <NavLink
        className="nav__link"
        activeClassName="active"
        to={`${adminRoute}/health-check`}
        style={{ margin: 0, fontWeight: "normal" }}
      >
        Health check status
      </NavLink>
    </div>
  );
};
