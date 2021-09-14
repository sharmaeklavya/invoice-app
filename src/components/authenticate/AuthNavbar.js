import React from "react";
import { Link } from "react-router-dom";

function AuthNavbar(props) {
  const BASE_URL = "#";

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow ">
      <div className="container">
        <Link to="/" className="navbar-brand auth__legend">
          {props.brand}
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
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-lg-0">
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                href={BASE_URL}
              >
                {props.menu1}
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                href={BASE_URL}
              >
                {props.menu2}
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                href={BASE_URL}
              >
                {props.menu3}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AuthNavbar;
