const express = require("express");
const router = express.Router();
const userRole = require("../model/userRoles");
const { userAuth, roleAuth } = require("../model/userAuth");

// user routes
const {
  register,
  login,
  logout,
  display_users,
  update_users,
  delete_users,
  reset_password,
  update_password,
} = require("../controller/users");

router.post("/display_users", userAuth, display_users);

router.post(
  "/update_users",
  userAuth,
  roleAuth([userRole.MANAGER, userRole.ADMIN]),
  update_users
);

router.post(
  "/delete_users",
  userAuth,
  roleAuth([userRole.ADMIN]),
  delete_users
);

router.post("/register", userAuth, roleAuth([userRole.ADMIN]), register);

router.post("/reset_password", reset_password);
router.post("/update_password/:rs", update_password);
router.post("/logout", logout);

router.post("/", login);

// refresh token / if user logged in
const { refresh_token } = require("../model/userAuth");
router.post("/refresh_token", refresh_token);

// invoice routes
const {
  create_invoice,
  display_invoice,
  update_invoice,
  delete_invoice,
} = require("../controller/invoices");

router.get("/display_invoice", userAuth, display_invoice);

router.post(
  "/create_invoice",
  userAuth,
  roleAuth([userRole.MANAGER, userRole.ADMIN]),
  create_invoice
);

router.post(
  "/update_invoice",
  userAuth,
  roleAuth([userRole.MANAGER, userRole.ADMIN]),
  update_invoice
);

router.post(
  "/delete_invoice",
  userAuth,
  roleAuth([userRole.ADMIN]),
  delete_invoice
);

module.exports = router;
