import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./pages/HomePage";
import "antd/dist/antd.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import ListingsPage from "./pages/ListingsPage";
import HostsPage from "./pages/HostsPage";
import ListingPage from "./pages/ListingPage";
import HostPage from "./pages/HostPage";

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact path="/" render={() => <HomePage />} />
        <Route exact path="/listings" render={() => <ListingsPage />} />
        <Route exact path="/hosts" render={() => <HostsPage />} />
        <Route path="/listing/:id" render={() => <ListingPage />} />
        <Route path="/host/:id" render={() => <HostPage />} />
      </Switch>
    </Router>
  </div>,
  document.getElementById("root")
);
