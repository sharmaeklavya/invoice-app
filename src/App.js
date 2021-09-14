import React from "react";
import AlertTemplate from "react-alert-template-basic";
import { transitions, Provider as AlertProvider } from "react-alert";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/authenticate/PrivateRoute";
import Authenticate from "./components/authenticate/Authenticate";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  const options = {
    offset: "30px",
    timeout: 5000,
    transition: transitions.FADE,
  };

  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Router>
        <Switch>
          <Route path="/user" component={Authenticate} />
          <PrivateRoute path="/" component={Dashboard} />
        </Switch>
      </Router>
    </AlertProvider>
  );
}

export default App;
