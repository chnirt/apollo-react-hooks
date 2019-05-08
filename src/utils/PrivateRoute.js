import React from "react";
import Auth from "../auth/Authenticate";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = route => (
  <Route
    render={() =>
      Auth.isAuthenticated ? (
        <route.component routes={route.routes} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default PrivateRoute;
