import React, { useEffect, useState } from "react";
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import Profile from "./Profile";
import Setting from "./Setting";
import TotalStats from "./TotalStats";
import CreateUser from "./CreateUser";
import CreateInvoice from "./CreateInvoice";
import UpdateUser from "./UpdateUser";
import UpdateInvoice from "./UpdateInvoice";
import axios from "axios";

function Dashboard() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [timer, setTimer] = useState();

  // use effect for updating current time
  useEffect(() => {
    const currentTime = new Date();
    // minutes to milliseconds
    const expireTimeLimit = 15 * 60000; // mins should match with refresh token expiry mins
    // getting login time from localstorage
    const loginTime = Number(localStorage.getItem("__lt"));
    // converting token expiration time into milliseconds
    const sessionTime = loginTime + expireTimeLimit;
    const expiresIn = sessionTime - currentTime.getTime();
    // getting back time into a readable format
    const result = msToTime(expiresIn);
    // setting interval to run every second
    const interval = setInterval(() => {
      setTimer(result);
    }, 1000);
    // clearing the same interval every second
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  // Converting milliseconds to seconds, minutes and hours
  function msToTime(duration) {
    if (duration > 0) {
      // Getting seconds, minutes and hours
      let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      // Formatting seconds, munites and hours
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      // Returning formatted
      return hours + ":" + minutes + ":" + seconds;
    } else {
      history.push("/");
    }
  }

  // sidebar - user and invoice menu
  const showMenu = (e) => {
    const button = e.target;
    const accordianContent = button.nextElementSibling;
    button.classList.toggle("accordian__btn--active");
    if (button.classList.contains("accordian__btn--active")) {
      accordianContent.style.maxHeight = accordianContent.scrollHeight + "px";
    } else {
      accordianContent.style.maxHeight = 0;
    }
  };

  //handling log out
  const handleLogout = () => {
    axios.post("https://node-invoice.herokuapp.com/logout").then((res) => {
      if (res.status === 200) history.push("/user/login");
      localStorage.removeItem("__lt");
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Navigation Bar starts */}

        <nav className="navbar navbar-expand-lg navbar-light shadow">
          <div className="container">
            <Link className="navbar-brand" to={path}>
              Dashboard
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto">
                <li className="nav-item my-auto">
                  <small className="me-2">Logging out in</small>
                  <small className="text-danger">{timer}</small>
                </li>
                <li className="nav-item dropdown">
                  <span
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src="/images/eklavya.jpg"
                      alt="profile-pic"
                      width="30px"
                      style={{ borderRadius: "50%" }}
                    />
                  </span>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                    style={{ right: 0, left: "auto" }}
                  >
                    <li>
                      <Link className="dropdown-item" to={`/profile`}>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to={`/setting`}>
                        Setting
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* Navigation Bar ends */}

        {/* Sidebar starts here */}
        <div className="col-md-2 px-0">
          <div className="accordian">
            <button
              type="button"
              className="btn btn-warning accordian__btn"
              onClick={showMenu}
            >
              User
            </button>
            <div className="accordian__content">
              <ul className="text-light">
                <li className="pb-2">
                  <Link to="/create-user">Create user</Link>
                </li>
                <li className="pb-2">
                  <Link to="/update-user">Update user</Link>
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="btn btn-warning accordian__btn"
              onClick={showMenu}
            >
              Invoice
            </button>
            <div className="accordian__content">
              <ul className="text-light">
                <li className="pb-2">
                  <Link to="/create-invoice">Create invoice</Link>
                </li>
                <li className="pb-2">
                  <Link to="/update-invoice">Update invoice</Link>
                </li>
              </ul>
            </div>
            {/* Log out button */}
            <div className="logout">
              <hr className="text-warning" />
              <button className="btn btn-danger" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </div>
        </div>
        {/* Sidebar ends here */}

        {/* Dashboard content starts here */}
        <div className="col-md-10">
          <div className="dash__vessel">
            <Switch>
              <Route path="/profile" component={Profile} exact />
              <Route path="/setting" component={Setting} exact />
              <Route path="/create-user" component={CreateUser} exact />
              <Route path="/update-user" component={UpdateUser} exact />
              <Route path="/create-invoice" component={CreateInvoice} exact />
              <Route path="/update-invoice" component={UpdateInvoice} exact />
              <Route path={`${path}`} component={TotalStats} exact />
            </Switch>
          </div>
        </div>

        {/* Dashboard content ends here */}
      </div>
    </div>
  );
}

export default Dashboard;
