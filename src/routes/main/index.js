import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./home";

// import asyncComponent from "../../util/asyncComponent";

const Main = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/home`} component={Home} />
  </Switch>
);

export default Main;
