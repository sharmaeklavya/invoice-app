import axios from "axios";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAlert, positions, types } from "react-alert";

function ResetPass() {
  const alert = useAlert();
  const history = useHistory();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://node-invoice.herokuapp.com/reset_password",
        { email },
        { withCredentials: true }
      )
      .then((res) => handleSubmitError(res))
      .catch((err) => handleSubmitError(err.response));
  };

  const handleSubmitError = (res) => {
    if (res.status === 200) {
      alert.show(res.data, {
        type: types.SUCCESS,
        position: positions.TOP_RIGHT,
      });
      history.push("/user");
    } else {
      alert.show(res.data, {
        type: types.ERROR,
        position: positions.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      <form className="row g-3" onSubmit={handleSubmit}>
        <h1 className="auth__legend">Trouble logging in?</h1>
        <p className="text-center pb-0">
          Enter your email to veify it's really you.
        </p>

        <div className="col-12">
          <input
            type="email"
            className="form-control"
            id="inputEmail3"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abc@example.com"
          />
        </div>

        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary w-50">
            Send a login link
          </button>
        </div>

        <div className="col-md-12">
          <p className="mt-3 mb-2 text-center">
            <small>
              We shall then send you a reset link, click on the link and follow
              furtuer instructions.
            </small>
          </p>
        </div>
      </form>
      <div className="col-md-12">
        <p className="mt-3 mb-2 text-center">
          <span>Is this a wrong page?&nbsp;</span>
          <Link to="/user/login">Login</Link>
        </p>
      </div>
    </>
  );
}

export default ResetPass;
