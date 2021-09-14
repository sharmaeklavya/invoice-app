import React, { useState, useContext, useEffect } from "react";
import { useAlert, positions, types } from "react-alert";
import UserContext from "../authenticate/UserContext";
import axios from "axios";

function UpdateInvoice() {
  const alert = useAlert(null);
  const { refToken } = useContext(UserContext);
  const [disabled, setDisabled] = useState(true);
  const [invoiceData, setInvoiceData] = useState([]);
  // for collecting product details
  const [itemInputs, setItemInputs] = useState([
    {
      description: "",
      rate: 0,
      qty: 0,
      amount: 0,
      taxPct: 0,
    },
  ]);
  // for collecting total of product rates and taxes
  const [total, setTotal] = useState({
    totalAmount: 0,
    totalTax: 0,
    totalPayable: 0,
  });
  // for collecting consignee/ consignor information / invoice number
  const [userInputs, setUserInputs] = useState({
    consignorName: "",
    consignorEmail: "",
    consignorAddress: "",
    consignorPhoneNumber: 0,

    consigneeName: "",
    consigneeEmail: "",
    consigneeAddress: "",
    consigneePhoneNumber: 0,

    invoiceNumber: 0,
    invoiceDueDate: "",
    invoiceNotes: "",
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

  // for fetching the all invoices from the server
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
    }, 500);
  }, []);

  // for setting up product information
  const handleItemInputs = (e, index) => {
    const values = [...itemInputs];
    values[index][e.target.name] = e.target.value;
    setItemInputs(values);
  };

  // for handling invoice totals, taxes etc.
  const handleTotals = (itemInputs) => {
    //total amount/tax  payable
    let totalAmount = itemInputs
      .map((item) => item.rate * item.qty)
      .reduce((acc, cv) => acc + cv);
    let totalTax = itemInputs
      .map((item) => (item.taxPct / 100) * item.amount)
      .reduce((acc, cv) => acc + cv);
    // taking only two decimals
    totalAmount = parseFloat(totalAmount).toFixed(2);
    totalTax = parseFloat(totalTax).toFixed(2);

    let totalPayable = Number(totalAmount) + Number(totalTax);
    totalPayable = totalPayable.toFixed(2);

    setTotal({ totalAmount, totalTax, totalPayable });
  };

  // updating totals to its latest upon any change in the product price, rate or taxes
  useEffect(() => {
    handleTotals(itemInputs);
  }, [itemInputs]);

  // for setting up other information
  const handleUserInputs = (e) => {
    const values = e.target.value;
    if (e.target.name === "invoiceDueDate") {
      const toDate = new Date().getTime();
      const dateSelected = new Date(e.target.value).getTime();
      if (dateSelected >= toDate)
        setUserInputs({ ...userInputs, [e.target.name]: values });
    } else {
      setUserInputs({ ...userInputs, [e.target.name]: values });
    }
  };

  // for adding more product input fields
  const handleAddFields = () => {
    setItemInputs([
      ...itemInputs,
      { description: "", rate: 0, qty: 0, amount: 0, taxPct: 0 },
    ]);
  };

  // for removing more product input fields
  const handleRemoveFields = (e, i) => {
    const productInputs = itemInputs.filter((item, index) =>
      itemInputs.length > 1 ? i !== index : item
    );
    setItemInputs([...productInputs]);
  };

  // for submitting all the updated invoice informtion to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // a pop up to ensure if user really want to update the invoice
      const ifYes = window.confirm("Are you sure want to update?");
      if (!ifYes) {
        alert.show("Request for updation cancelled", {
          type: types.ERROR,
          position: positions.TOP_RIGHT,
        });
      } else {
        const data = { ...userInputs, products: [...itemInputs], ...total };
        const res = await axios.post(
          "https://node-invoice.herokuapp.com/update_invoice",
          data,
          { withCredentials: true }
        );
        handleSubmitError(res);
      }
    } catch (err) {
      console.log(err.response);
      handleSubmitError(err.response);
    }
  };

  // for deleting the invoice
  const handleDeleteInvoice = () => {
    // a pop up to ensure if user really want to delete the invoice
    const ifYes = window.confirm(
      "Are you sure want to delete? This action cannot be undone. Please choose the option carefully."
    );
    // send request to delete the invoice
    if (ifYes) {
      const invoiceNumber = userInputs.invoiceNumber;
      axios
        .post(
          "https://node-invoice.herokuapp.com/delete_invoice",
          { invoiceNumber },
          { withCredentials: true }
        )
        .then((res) => {
          handleSubmitError(res);
          window.location.reload();
        })
        .catch((err) => handleSubmitError(err.response));
    } else {
      alert.show("Request for deletion cancelled", {
        type: types.ERROR,
        position: positions.TOP_RIGHT,
      });
    }
  };

  // for handling the error received from the invoice submission request (if any)
  const handleSubmitError = (res) => {
    if (res.status === 200) {
      alert.show(res.data, {
        type: types.SUCCESS,
        position: positions.TOP_RIGHT,
      });
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
            <small className="col-sm-3">Client Name</small>
            <small className="col-sm-3">Client Email</small>
            <small className="col-sm-2">Invoice number</small>
            <small className="col-sm-2">Payment due date</small>
            <small className="col-sm-2">Total Payable</small>
          </div>
        </div>
      </div>
      {invoiceData.length > 0 ? (
        invoiceData.map((invoice, index) => (
          <div className="card" key={index}>
            <div className="card-body" style={{ placeItems: "center" }}>
              <div className="row mx-auto">
                <small className="col-sm-3">{invoice.consigneeName}</small>
                <small className="col-sm-3">{invoice.consigneeEmail}</small>
                <small className="col-sm-2">{invoice.invoiceNumber}</small>
                <small className="col-sm-2">
                  {invoice.invoiceDueDate.split("T")[0]}
                </small>
                <small className="col-sm-2">{invoice.totalAmount}</small>
                <div className="col-sm-12">
                  <input
                    id={index}
                    type="radio"
                    name="edit-btn"
                    className="edit__btn"
                    onClick={() => {
                      // setting existing value
                      //  user inputs
                      setUserInputs({
                        consignorName: invoice.consignorName,
                        consignorEmail: invoice.consignorEmail,
                        consignorAddress: invoice.consignorAddress,
                        consignorPhoneNumber: invoice.consignorPhoneNumber,
                        consigneeName: invoice.consigneeName,
                        consigneeEmail: invoice.consigneeEmail,
                        consigneeAddress: invoice.consigneeAddress,
                        consigneePhoneNumber: invoice.consigneePhoneNumber,
                        invoiceNumber: invoice.invoiceNumber,
                        invoiceDueDate: invoice.invoiceDueDate,
                        invoiceNotes: invoice.invoiceNotes,
                      });

                      // products details
                      setItemInputs([...invoice.products]);

                      // total payable, tax etc
                      setTotal({
                        totalAmount: invoice.totalAmount,
                        totalTax: invoice.totalTax,
                        totalPayable: invoice.totalPayable,
                      });

                      // cancel button
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
                    style={{ maxWidth: "900px" }}
                  >
                    <div className="row g-3">
                      {/* Self details starts here */}

                      <div className="col-md-6">
                        <h3 className="lead">From</h3>
                        <hr className="w-25" />
                        {/* Name */}
                        <div className="row mb-3">
                          <label
                            htmlFor="inputName"
                            className="col-sm-3 col-form-label"
                          >
                            Name
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              name="consignorName"
                              value={userInputs.consignorName}
                              className="form-control"
                              id="inputName"
                              placeholder="Individual / Organization name"
                              onChange={handleUserInputs}
                              readOnly
                            />
                          </div>
                        </div>
                        {/* Email */}
                        <div className="row mb-3">
                          <label
                            htmlFor="inputEmail5"
                            className="col-sm-3 col-form-label"
                          >
                            Email
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="email"
                              name="consignorEmail"
                              value={userInputs.consignorEmail}
                              className="form-control"
                              id="inputEmail5"
                              placeholder="Email Address"
                              onChange={handleUserInputs}
                            />
                          </div>
                        </div>
                        {/* Address */}
                        <div className="row mb-3">
                          <label
                            htmlFor="inputAddress"
                            className="col-sm-3 col-form-label"
                          >
                            Address
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              name="consignorAddress"
                              value={userInputs.consignorAddress}
                              className="form-control"
                              id="inputAddress"
                              placeholder="1234 Main St"
                              onChange={handleUserInputs}
                            />
                          </div>
                        </div>
                        {/* Phone */}
                        <div className="row mb-3">
                          <label
                            htmlFor="inputPhone"
                            className="col-sm-3 col-form-label"
                          >
                            Phone
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="number"
                              name="consignorPhoneNumber"
                              value={userInputs.consignorPhoneNumber}
                              className="form-control"
                              id="inputPhone"
                              placeholder="+91 9876543210"
                              min="0"
                              minLength="10"
                              maxLength="10"
                              onChange={handleUserInputs}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Self details ends here */}

                      {/* Client Details starts here */}

                      <div className="col-md-6">
                        <h3 className="lead">Bill to</h3>
                        <hr className="w-25" />
                        {/* Name */}
                        <div className="row mb-3">
                          <label
                            htmlFor="inputName2"
                            className="col-sm-3 col-form-label"
                          >
                            Name
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              name="consigneeName"
                              value={userInputs.consigneeName}
                              className="form-control"
                              id="inputName2"
                              placeholder="Individual / Organization name"
                              onChange={handleUserInputs}
                              readOnly
                            />
                          </div>
                        </div>
                        {/* Email */}
                        <div className="row mb-3">
                          <label
                            htmlFor="inputEmail6"
                            className="col-sm-3 col-form-label"
                          >
                            Email
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="email"
                              name="consigneeEmail"
                              value={userInputs.consigneeEmail}
                              className="form-control"
                              id="inputEmail6"
                              placeholder="Email Address"
                              onChange={handleUserInputs}
                            />
                          </div>
                        </div>
                        {/* Address */}
                        <div className="row mb-3">
                          <label
                            htmlFor="inputAddress2"
                            className="col-sm-3 col-form-label"
                          >
                            Address
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              name="consigneeAddress"
                              value={userInputs.consigneeAddress}
                              className="form-control"
                              id="inputAddress2"
                              placeholder="1234 Main St"
                              onChange={handleUserInputs}
                            />
                          </div>
                        </div>
                        {/* Phone */}
                        <div className="row mb-3">
                          <label
                            htmlFor="inputPhone2"
                            className="col-sm-3 col-form-label"
                          >
                            Phone
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="number"
                              name="consigneePhoneNumber"
                              value={userInputs.consigneePhoneNumber}
                              className="form-control"
                              id="inputPhone2"
                              placeholder="+91 9876543210"
                              min="0"
                              minLength="10"
                              maxLength="10"
                              onChange={handleUserInputs}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Client Details starts here */}

                      <hr className="w-100" />

                      {/* Invoice Number and Due Date */}

                      <div className="col-md-6">
                        <div className="row mb-3">
                          <label
                            htmlFor="inputInvoiceDueDate"
                            className="col-sm-3 col-form-label"
                          >
                            Due Date
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="date"
                              name="invoiceDueDate"
                              value={
                                userInputs.invoiceDueDate !== undefined
                                  ? userInputs.invoiceDueDate.split("T")[0]
                                  : userInputs.invoiceDueDate
                              }
                              className="form-control"
                              id="inputInvoiceDueDate"
                              placeholder="01/01/2021"
                              onChange={handleUserInputs}
                              required
                            />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label
                            htmlFor="inputInvoiceNumber"
                            className="col-sm-3 col-form-label"
                          >
                            Invoice Number
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="number"
                              name="invoiceNumber"
                              value={userInputs.invoiceNumber}
                              className="form-control"
                              id="inputInvoiceNumber"
                              placeholder="INV0001"
                              min="0"
                              maxLength="7"
                              onChange={handleUserInputs}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="row mb-2">
                          <p className="fst-italic text-danger">
                            Payment due date must be later than today.
                          </p>
                        </div>
                      </div>

                      {/* Invoice Number and Due Date ends here */}

                      <hr className="w-100" />

                      {/* Item Description, qty, tax and amount */}

                      <div className="col-md-12">
                        {itemInputs.map((item, index) => (
                          <div className="row mb-2" key={index}>
                            <div className="col-md-1 my-2 d-flex align-self-center">
                              <i
                                className="far fa-plus-square font__icon"
                                onClick={(e) => handleAddFields(e, index)}
                              ></i>
                              <i
                                className="far fa-minus-square font__icon"
                                onClick={(e) => handleRemoveFields(e, index)}
                              ></i>
                            </div>
                            <div className="col-md-3 mb-2">
                              <label
                                htmlFor="inputDescription"
                                className="form-label"
                              >
                                Description
                              </label>
                              <textarea
                                name="description"
                                value={item.description}
                                className="form-control"
                                id="inputDescription"
                                placeholder="item description"
                                rows="1"
                                required
                                onChange={(e) => handleItemInputs(e, index)}
                              />
                            </div>
                            <div className="col-md-2 mb-2">
                              <label htmlFor="inputRate" className="form-label">
                                Rate
                              </label>
                              <input
                                type="number"
                                name="rate"
                                value={item.rate}
                                className="form-control"
                                id="inputRate"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                onChange={(e) => handleItemInputs(e, index)}
                              />
                            </div>
                            <div className="col-md-2 mb-2">
                              <label htmlFor="inputQty" className="form-label">
                                Qty
                              </label>
                              <input
                                type="number"
                                name="qty"
                                value={item.qty}
                                className="form-control"
                                id="inputQty"
                                min="1"
                                step="0.01"
                                placeholder="00"
                                onChange={(e) => handleItemInputs(e, index)}
                              />
                            </div>
                            <div className="col-md-2 mb-2">
                              <label
                                htmlFor="inputAmount"
                                className="form-label"
                              >
                                Amount
                              </label>
                              <input
                                name="amount"
                                value={
                                  (item.amount = (item.qty * item.rate).toFixed(
                                    2
                                  ))
                                }
                                className="form-control"
                                id="inputAmount"
                                readOnly
                              />
                            </div>
                            <div className="col-md-2 mb-2">
                              <label htmlFor="inputTax" className="form-label">
                                Tax (%)
                              </label>
                              <input
                                type="number"
                                name="taxPct"
                                value={item.taxPct}
                                className="form-control"
                                id="inputTax"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                onChange={(e) => handleItemInputs(e, index)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Item Description, qty, tax and amount ends here */}

                      <hr className="w-100" />

                      {/* subtotal, tax and total */}

                      <div className="col-md-12">
                        <div className="row text-end">
                          <p className="col-sm-9">Amount before tax</p>
                          <p className="col-sm-3">{total.totalAmount}</p>
                        </div>
                        <div className="row text-end">
                          <p className="col-sm-9">Tax Amount</p>
                          <p className="col-sm-3">{total.totalTax}</p>
                        </div>
                        <div className="row text-end">
                          <p className="col-sm-9">Total Payable</p>
                          <p className="col-sm-3">{total.totalPayable}</p>
                        </div>
                        <div className="row text-end">
                          <p className="col-sm-9">Balance due</p>
                          <p className="col-sm-3">{`${Math.round(
                            total.totalPayable
                          )}.00`}</p>
                        </div>
                      </div>

                      {/* subtotal, tax and total ends here */}

                      <hr className="w-100 mb-3" />

                      {/* Invoice bottom - Notes area */}

                      <div className="col-md-12 mb-3">
                        <textarea
                          name="invoiceNotes"
                          value={userInputs.invoiceNotes}
                          className="form-control"
                          id="inputNotes"
                          placeholder="Any additional notes for the client?"
                          rows="5"
                          onChange={handleUserInputs}
                        />
                      </div>

                      {/* Invoice bottom - Notes/ Main Row area ends here */}
                    </div>

                    {/* Submit Button */}

                    <div className="row mb-2">
                      <div className="col">
                        <button type="submit" className="btn btn-primary">
                          Update Invoice
                        </button>
                      </div>
                      <div className="col text-end">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={handleDeleteInvoice}
                        >
                          Delete Invoice
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
            Please wait a few seconds while we display the invoices here.
          </p>
          <p>
            If you still do not see any invoices, you might wanna create one
            first.
          </p>
        </div>
      )}
    </div>
  );
}

export default UpdateInvoice;
