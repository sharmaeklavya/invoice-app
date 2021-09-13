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
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="/" component={Authenticate} />
        </Switch>
      </Router>
    </AlertProvider>
  );
}

export default App;
