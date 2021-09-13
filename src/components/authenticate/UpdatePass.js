import React, { useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useAlert, positions, types } from "react-alert";
import axios from "axios";

function UpdatePass() {
  // starts here
  const alert = useAlert(null);
  const history = useHistory();
  const { url } = useRouteMatch();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const success = {
    type: types.SUCCESS,
    position: positions.TOP_CENTER,
    containerStyle: {
      offset: "150px",
      padding: "150px",
    },
  };

  const error = {
    type: types.ERROR,
    position: positions.TOP_CENTER,
    containerStyle: {
      offset: "150px",
      padding: "150px",
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rs = url.split("/update/")[1];

    if (password === confirmPassword) {
      axios
        .post(
          `https://node-invoice.herokuapp.com/update_password/${rs}`,
          { password },
          { withCredentials: true }
        )
        .then((res) => {
          handleSubmitError(res);
          history.push("/");
        })
        .catch((err) => handleSubmitError(err.response));
    } else {
      alert.show("passwords donot match. Try again", error);
    }
  };

  const handleSubmitError = (res) => {
    if (res.status === 200) {
      alert.show(res.data, success);
    } else {
      alert.show(res.data, error);
    }
  };

  return (
    <>
      <form className="row g-3" onSubmit={handleSubmit}>
        <h1 className="auth__legend">Update Password</h1>
        <div className="col-md-3 mb-3">
          <label htmlFor="inputPassword4" className="form-label">
            Password
          </label>
        </div>
        <div className="col-md-9 mb-3">
          <input
            type="password"
            className="form-control"
            id="inputPassword4"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="inputPassword5" className="form-label">
            Confirm Password
          </label>
        </div>
        <div className="col-md-9 mb-3">
          <input
            type="password"
            className="form-control"
            id="inputPassword5"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-success w-50">
            Update now
          </button>
        </div>
      </form>
    </>
  );
}

export default UpdatePass;
