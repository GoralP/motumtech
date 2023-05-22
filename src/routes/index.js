import React from "react";
import { Route, Switch } from "react-router-dom";

import Main from "./main/index";
import asyncComponent from "util/asyncComponent";
const App = ({ match }) => (
  <div className="gx-main-content-wrapper">
    <Switch>
      <Route path={`${match.url}main`} component={Main} />
      <Route
        path={`${match.url}/forgot-password`}
        component={asyncComponent(() =>
          import("../containers/forgot-password")
        )}
      />
    </Switch>
  </div>
);

export default App;
