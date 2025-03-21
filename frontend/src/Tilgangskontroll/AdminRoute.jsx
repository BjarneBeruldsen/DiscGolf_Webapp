//Author: Severin Waller Sørensen

import React from "react";
import { Route, Redirect } from "react-router-dom";

const AdminRoute = ({ component: Component, loggetInnBruker, ...rest }) => {
    return (
    <Route
      {...rest}
      render={(props) =>
        loggetInnBruker && loggetInnBruker.rolle === "admin" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/Innlogging" />
        )
      }
    />
  );
};

export default AdminRoute;
