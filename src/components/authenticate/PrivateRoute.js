import React, { useEffect, useState, useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { BoltLoader } from "react-awesome-loaders";
import UserContext from "./UserContext";
import axios from "axios";

function PrivateRoute({ component: Component, ...rest }) {
  const { setRefToken } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(-1);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post(
          "https://node-invoice.herokuapp.com/refresh_token",
          {},
          { withCredentials: true }
        );
        if (res.data.accessToken) {
          setIsLoggedIn(1);
          setRefToken(res.data.refreshToken);
        }
      } catch (err) {
        setIsLoggedIn(0);
        console.log(err.message);
      }
    })();
  }, [setRefToken]);

  if (isLoggedIn === -1)
    return (
      <div className="dash__vessel">
        <BoltLoader
          className={"loaderbolt"}
          boltColor={"#6366F1"}
          backgroundBlurColor={"#E0E7FF"}
        />
      </div>
    );

  if (isLoggedIn === 0) return <Redirect to="/" />;

  if (isLoggedIn === 1)
    return <Route {...rest} render={(props) => <Component {...props} />} />;
}

export default PrivateRoute;
