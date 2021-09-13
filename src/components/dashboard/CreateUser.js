import React, { useState } from "react";
import { useAlert, positions, types } from "react-alert";
import axios from "axios";

function CreateUser() {
  const alert = useAlert(null);

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

  const handleUserInputs = (e) => {
    const value = e.target.value;
    setUserInfo({ ...userInfo, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // a pop up to ensure if you really want to create a user
      const ifYes = window.confirm("Are you sure want to create?");
      // send request to create a user to database
      if (!ifYes) {
        alert.show("Request cancelled", {
          type: types.ERROR,
          position: positions.TOP_RIGHT,
        });
      } else {
        const res = await axios.post(
          "https://node-invoice.herokuapp.com/register",
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

  // for error handling received from the form submission request
  const handleSubmitError = (res) => {
    if (res === 200) {
      alert.show("User created", {
        type: types.SUCCESS,
        position: positions.TOP_RIGHT,
      });
      setTimeout(() => handleClearForm(), 1000);
    } else {
      alert.show(res.data, {
        type: types.ERROR,
        position: positions.TOP_RIGHT,
      });
    }
  };

  const handleClearForm = () => {
    setUserInfo({
      role: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dateOfBirth: "",
      gender: "",
      accountStatus: false,
    });
  };

  return (
    <form
      className="row g-3 mt-2"
      onSubmit={handleSubmit}
      style={{ maxWidth: "400px" }}
    >
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
          aria-label="gender-form-select"
          name="accountStatus"
          value={userInfo.accountStatus}
          onChange={handleUserInputs}
        >
          <option value={false}>Deactivated</option>
          <option value={true}>Activated</option>
        </select>
      </div>
      <div className="col-md-6">
        <label htmlFor="inputFirstName1" className="form-label">
          First Name
        </label>
        <input
          type="text"
          className="form-control"
          id="inputFirstName1"
          name="firstName"
          value={userInfo.firstName}
          onChange={handleUserInputs}
          required
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="inputLastName1" className="form-label">
          Last Name
        </label>
        <input
          type="text"
          className="form-control"
          id="inputLastName1"
          name="lastName"
          value={userInfo.lastName}
          onChange={handleUserInputs}
          required
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="inputEmail4" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="inputEmail4"
          name="email"
          value={userInfo.email}
          onChange={handleUserInputs}
          required
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="inputPassword4" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="inputPassword4"
          name="password"
          value={userInfo.password}
          onChange={handleUserInputs}
          required
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="inputDate" className="form-label">
          Date of Birth
        </label>
        <input
          type="date"
          className="form-control"
          id="inputDate"
          name="dateOfBirth"
          value={userInfo.dateOfBirth}
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
            id="gridCheck"
            required
          />
          <label className="form-check-label" htmlFor="gridCheck">
            Confirm, the above info is correct.
          </label>
        </div>
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-primary">
          Create user
        </button>
      </div>
    </form>
  );
}
export default CreateUser;
