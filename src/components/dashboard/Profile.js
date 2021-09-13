import { useEffect, useContext, useState } from "react";
import UserContext from "../authenticate/UserContext";
import jwt from "jwt-decode";

function Profile() {
  const { refToken } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState({
    userName: "",
    email: "",
    role: "",
    userAccess: "",
    invoiceAccess: "",
  });

  useEffect(() => {
    if (refToken) {
      const user = jwt(refToken);
      accessType(user);
    }
  }, [refToken]);

  function accessType(user) {
    if (user.role === "admin") {
      setUserInfo({
        ...user,
        userAccess: "Create, Read, Update and Delete",
        invoiceAccess: "Create, Read, Update and Delete",
      });
    } else if (user.role === "manager") {
      setUserInfo({
        ...user,
        userAccess: "Create, Read, and Update",
        invoiceAccess: "Create, Read, and Update",
      });
    } else {
      setUserInfo({
        ...user,
        userAccess: "Create and Read",
        invoiceAccess: "Create and Read",
      });
    }
  }

  return (
    <div className="card" style={{ maxWidth: "400px" }}>
      <h5 className="card-header py-3">Profile</h5>
      <div className="card-body p-4">
        <fieldset className="row" disabled>
          <div className="mb-3">
            <label
              htmlFor="disabledTextInput1"
              className="form-label label__text"
            >
              User Name
            </label>
            <input
              type="text"
              id="disabledTextInput1"
              className="form-control"
              defaultValue={userInfo.userName}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="disabledTextInput2"
              className="form-label label__text"
            >
              User Email
            </label>
            <input
              type="email"
              id="disabledTextInput2"
              className="form-control"
              defaultValue={userInfo.email}
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="disabledTextInput5"
              className="form-label label__text"
            >
              User Type
            </label>
            <input
              type="text"
              id="disabledTextInput5"
              className="form-control"
              defaultValue={userInfo.role}
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="disabledTextInput3"
              className="form-label label__text"
            >
              User Acces
            </label>
            <input
              type="text"
              id="disabledTextInput3"
              className="form-control"
              defaultValue={userInfo.userAccess}
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="disabledTextInput4"
              className="form-label label__text"
            >
              Invoice Access
            </label>
            <input
              type="text"
              id="disabledTextInput4"
              className="form-control"
              defaultValue={userInfo.invoiceAccess}
            />
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default Profile;
