import React, { useState } from "react";

const UserContext = React.createContext();
export default UserContext;

export const UserProvider = ({ children }) => {
  const [refToken, setRefToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [sessionTimer, setSessionTimer] = useState("");

  return (
    <UserContext.Provider
      value={{
        sessionTimer,
        setSessionTimer,
        accessToken,
        setAccessToken,
        refToken,
        setRefToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
