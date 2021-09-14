import React from "react";
import { Link } from "react-router-dom";

function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <form className="row g-3" onSubmit={handleSubmit}>
        <h1 className="auth__legend">Sign up</h1>
        <p className="text-center mt-0">It's quite easy</p>
        <div className="col-md-6">
          <label htmlFor="inputFirstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputFirstName"
            placeholder="John"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputLastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputLastName"
            placeholder="Doe"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputEmail2" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail2"
            placeholder="abc@example.com"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPassword2" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword2"
            placeholder="*****"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputDate" className="form-label">
            Date of Birth
          </label>
          <input type="date" className="form-control" id="inputDate" />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputGender" className="form-label">
            Gender
          </label>
          <select
            className="form-select form-select-md mb-3"
            aria-label="gender-form-select"
          >
            <option defaultValue disabled>
              Select Pronoun
            </option>
            <option value="she">She</option>
            <option value="he">He</option>
            <option value="they">They</option>
          </select>
        </div>
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-secondary w-50">
            Sign up
          </button>
        </div>
      </form>
      <div className="col-md-12">
        <p className="mt-3 mb-3 text-center">
          <span>Already have an account?&nbsp;</span>
          <Link to="/user">Login</Link>
        </p>
      </div>
    </>
  );
}

export default Register;
