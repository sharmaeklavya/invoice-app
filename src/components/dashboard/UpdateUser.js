import React, { useContext, useEffect, useState } from "react";
import { useAlert, positions, types } from "react-alert";
import UserContext from "../authenticate/UserContext";
import axios from "axios";

function UpdateUser() {
  // starts here
  const alert = useAlert(null);
  const { refToken } = useContext(UserContext);
  const [userData, setUserData] = useState([]);
  const [disabled, setDisabled] = useState(true);

  //use state for user info collection
  const [userInfo, setUserInfo] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    accountStatus: false,
  });

  // attaching refresh token with every request
  axios.interceptors.request.use(
    (config) => {
      if (refToken) config.headers.authorization = `Bearer ${refToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // sends request receive information to/from the server
  useEffect(() => {
    setTimeout(() => {
      axios
        .post(
          "https://node-invoice.herokuapp.com/display_users",
          {},
          { withCredentials: true }
        )
        .then((res) => setUserData(res.data))
        .catch(function (err) {
          console.log(err.response);
        });
    }, 500);
  }, []);

  const handleUserInputs = (e) => {
    const value = e.target.value;
    setUserInfo({ ...userInfo, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // a pop up to ensure if you really want to update
    const ifYes = window.confirm("Are you sure want to update?");
    try {
      // send request to update a user to database
      if (!ifYes) {
        alert.show("Request cancelled", {
          type: types.ERROR,
          position: positions.TOP_RIGHT,
        });
      } else {
        const res = await axios.post(
          "https://node-invoice.herokuapp.com/update_users",
          userInfo,
          { withCredentials: true }
        );
        handleSubmitError(res.status);
      }
    } catch (err) {
      console.log(err.response);
      handleSubmitError(err.response);
    }
  };

  // handling delete operation
  const handleDeleteUser = async () => {
    // a pop up to ensure if you really want to delete
    const ifYes = window.confirm(
      "Are you sure want to delete? This operation cannot be undone. Please choose the option carefully."
    );
    try {
      // send request to remove a user from the database
      if (!ifYes) {
        alert.show("Request cancelled", {
          type: types.ERROR,
          position: positions.TOP_RIGHT,
        });
      } else {
        const res = await axios.post(
          "https://node-invoice.herokuapp.com/delete_users",
          { email: userInfo.email },
          { withCredentials: true }
        );
        handleSubmitError(res.status);
      }
    } catch (err) {
      console.log(err.response);
      handleSubmitError(err.response);
    }
  };

  // for error handling received from the form submission request
  const handleSubmitError = (res) => {
    if (res === 200) {
      alert.show("User updated", {
        type: types.SUCCESS,
        position: positions.TOP_RIGHT,
      });
      setTimeout(() => window.location.reload(), 400);
    } else {
      alert.show(res.data, {
        type: types.ERROR,
        position: positions.TOP_RIGHT,
      });
    }
  };

  const handleCancelBtn = () => {
    setDisabled(false);
  };

  return (
    <div className="edit__container">
      <div className="card">
        <div className="card-body bg-secondary text-light">
          <div className="row mx-auto">
            <small className="col-sm-3">User Name</small>
            <small className="col-sm-3">User Email</small>
            <small className="col-sm-2">User Role</small>
            <small className="col-sm-2">Date of Birth</small>
            <small className="col-sm-2">Created on</small>
          </div>
        </div>
      </div>
      {userData.length > 0 ? (
        userData.map((user, index) => (
          <div className="card" key={index}>
            <div className="card-body" style={{ placeItems: "center" }}>
              <div className="row mx-auto">
                <small className="col-sm-3">{`${user.firstName}  ${user.lastName}`}</small>
                <small className="col-sm-3">{user.email}</small>
                <small className="col-sm-2">{user.role}</small>
                <small className="col-sm-2">
                  {user.dateOfBirth.split("T")[0]}
                </small>
                <small className="col-sm-2">
                  {user.dateCreated.split("T")[0]}
                </small>
                <div className="col-sm-12">
                  <input
                    id={index}
                    type="radio"
                    name="edit-btn"
                    className="edit__btn"
                    onClick={() => {
                      // setting existing value
                      setUserInfo({
                        role: user.role,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        password: "",
                        dateOfBirth: user.dateOfBirth,
                        gender: user.gender,
                        accountStatus: user.accountStatus,
                      });

                      handleCancelBtn();
                    }}
                  />
                  <label htmlFor={index} className="edit__label">
                    Edit
                  </label>

                  {/*  */}
                  <button
                    type="button"
                    disabled={disabled}
                    className="cancel__btn"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    Cancel
                  </button>
                  {/*  */}

                  <form
                    className="edit__content"
                    onSubmit={handleSubmit}
                    style={{ maxWidth: "400px" }}
                  >
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="selectUserRole" className="form-label">
                          User Role
                        </label>
                        <select
                          className="form-select form-select-md mb-3"
                          aria-label="gender-form-select"
                          name="role"
                          value={userInfo.role}
                          onChange={handleUserInputs}
                        >
                          <option defaultValue disabled>
                            Select Role
                          </option>
                          <option value="executive">Executive</option>
                          <option value="manager">Manager</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="selectUserRole" className="form-label">
                          Account Status
                        </label>
                        <select
                          className="form-select form-select-md mb-3"
                          aria-label="account-status-form-select"
                          name="accountStatus"
                          value={userInfo.accountStatus}
                          onChange={handleUserInputs}
                        >
                          <option value={false}>Deactivated</option>
                          <option value={true}>Activated</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor={`inputFirstName${index}`}
                          className="form-label"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`inputFirstName${index}`}
                          name="firstName"
                          value={userInfo.firstName}
                          onChange={handleUserInputs}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor={`inputLastName${index}`}
                          className="form-label"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`inputLastName${index}`}
                          name="lastName"
                          value={userInfo.lastName}
                          onChange={handleUserInputs}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor={`inputEmail${index}`}
                          className="form-label"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id={`inputEmail${index}`}
                          name="email"
                          value={userInfo.email}
                          onChange={handleUserInputs}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor={`inputPassword${index}`}
                          className="form-label"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id={`inputPassword${index}`}
                          name="password"
                          value={userInfo.password}
                          onChange={handleUserInputs}
                          placeholder="**********"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor={`inputDOB${index}`}
                          className="form-label"
                        >
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id={`inputDOB${index}`}
                          name="dateOfBirth"
                          value={
                            userInfo.dateOfBirth !== undefined
                              ? userInfo.dateOfBirth.split("T")[0]
                              : userInfo.dateOfBirth
                          }
                          onChange={handleUserInputs}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="inputGender" className="form-label">
                          Gender
                        </label>
                        <select
                          className="form-select form-select-md mb-3"
                          aria-label="gender-form-select"
                          name="gender"
                          value={userInfo.gender}
                          onChange={handleUserInputs}
                        >
                          <option defaultValue disabled>
                            Select Pronoun
                          </option>
                          <option value="she">She</option>
                          <option value="he">He</option>
                          <option value="they">They</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`gridCheck${index}`}
                            required
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`gridCheck${index}`}
                          >
                            Confirm, the above info is correct.
                          </label>
                        </div>
                      </div>
                      <div className="col-6 ">
                        <button type="submit" className="btn btn-primary">
                          Update user
                        </button>
                      </div>
                      <div className="col-6 px-5">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={handleDeleteUser}
                        >
                          Delete user
                        </button>
                      </div>
                    </div>
                  </form>

                  {/*  */}
                  {/*  */}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center">
          <p className="lead">
            Please wait a few seconds while we display the users here.
          </p>
          <p>
            If you still do not see any users, you might wanna create one first.
          </p>
        </div>
      )}
    </div>
  );
}

export default UpdateUser;
