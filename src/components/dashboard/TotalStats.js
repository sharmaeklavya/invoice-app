import React, { useState, useEffect, useContext } from "react";
import UserContext from "../authenticate/UserContext";
import axios from "axios";

function TotalStats() {
  const { refToken } = useContext(UserContext);
  const [invoiceData, setInvoiceData] = useState([]);

  // attaching refresh token with request for validation
  axios.interceptors.request.use(
    (config) => {
      if (refToken) config.headers.authorization = `Bearer ${refToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    setTimeout(() => {
      axios
        .get("https://node-invoice.herokuapp.com/display_invoice", {
          withCredentials: true,
        })
        .then((res) => setInvoiceData(res.data))
        .catch(function (err) {
          console.log(err.response);
        });
    }, 300);
  }, []);

  return (
    <div className="total__stats">
      <p className="lead mt-3 text-center">
        Total invoice generated
        <span className="d-block h2 py-2">{invoiceData.length}</span>
      </p>
    </div>
  );
}

export default TotalStats;
