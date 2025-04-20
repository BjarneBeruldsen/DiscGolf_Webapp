//Author: Severin Waller Sørensen

/* Denne filen definerer en beskyttet rute i React
 * Den sjekker om en bruker er logget inn og har rolle
 * som admin eller hoved-admin.
 */

import React from "react";
import { Route, Redirect } from "react-router-dom";

const AdminRoute = ({ component: Component, loggetInnBruker, ...rest }) => {
    return (
    <Route
      {...rest}
      render={(props) =>
        loggetInnBruker && 
        (loggetInnBruker.rolle === "admin" || loggetInnBruker.rolle === "hoved-admin") ? (
          <Component {...props} /> // spread-syntaks, forslag til forbedring fra Copilot
        ) : (
          <Redirect to="/Innlogging" /> // Hvis ikke, send (redirect) brukeren til innloggingssiden
        )
      }
    />
  );
};

// Eksporterer ruten for bruk i andre filer
export default AdminRoute;
