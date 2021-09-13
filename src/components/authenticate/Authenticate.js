import React from "react";
import { Switch, Route, useRouteMatch, useLocation } from "react-router-dom";
import { useTransition, animated } from "react-spring";
import AuthNavbar from "./AuthNavbar";
import AuthFacts from "./AuthFacts";
import UpdatePass from "./UpdatePass";
import ResetPass from "./ResetPass";
import Register from "./Register";
import Login from "./Login";

function Authenticate() {
  const { path } = useRouteMatch();
  const location = useLocation();

  const transitions = useTransition(location, {
    from: {
      opacity: 0,
      transform: "translateX(0%)",
    },
    enter: {
      opacity: 1,
      width: "400px",
      position: "absolute",
      top: "8%",
      left: "50%",
      transform: "translateX(-50%)",
    },
    leave: {
      opacity: 0,
      transform: "translateX(0%)",
    },
  });
  const transition = transitions((props, item) => (
    <animated.div style={props}>
      <Switch location={item}>
        <Route path={`${path}register`} component={Register} exact />
        <Route path={`${path}reset`} component={ResetPass} exact />
        <Route path={`${path}update/:id`} component={UpdatePass} exact />
        <Route path={`${path}`} component={Login} />
      </Switch>
    </animated.div>
  ));

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <AuthNavbar
            brand="Invoice"
            menu1="Features"
            menu2="Services"
            menu3="Contact"
          />
          <div className="col-md-9">
            <div className="auth__vessel">{transition}</div>
          </div>
          <div className="col-md-3 px-0">
            <AuthFacts />
          </div>
        </div>
      </div>
    </>
  );
}

export default Authenticate;
