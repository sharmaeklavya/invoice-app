const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserCollection = require("../model/userSchema");
const { signedJWT } = require("../model/userAuth");
const { emailer, verificationString } = require("../model/emailer");

// Supplying random string and email address
// const { emailer, randomStr } = require("../models/emailer");

// ******** Handling Schema errors ************ //
// ******************************************** //

const handleErrors = (err) => {
  const errors = {
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
  };
  if (err.code === 11000) {
    errors.email = "User email already exists";
    return errors;
  }
  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// ******** User Registration ***************** //
// ******************************************** //

module.exports.register = async (req, res) => {
  try {
    // destructing registration form fields
    const {
      role,
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      gender,
      dateCreated,
      accountStatus,
      refreshToken,
      invoiceId,
      randomString,
    } = req.body;

    // hashing user password
    const hashedPassword =
      password.length >= 6 ? await bcrypt.hash(password, 11) : "";

    // submitting new user to the database
    const userCreated = await UserCollection.create({
      role,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      dateCreated,
      accountStatus,
      refreshToken,
      invoiceId,
      randomString,
    });

    // if above opertion is successful sends a green signal
    if (userCreated) {
      res.status(200).json("User registered successfully");
    } else {
      res.status(400).json("User could not be registered");
    }

    // if any errors, send them
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

// ******** User Login ************************ //
// ******************************************** //
module.exports.login = async (req, res) => {
  try {
    // check if the user exists in the database
    const userExists = await UserCollection.findOne({
      email: req.body.email,
      accountStatus: true,
    });

    if (userExists) {
      // checking if the password matches with the user password
      const isPassValid = await bcrypt.compare(
        req.body.password,
        userExists.password
      );
      // proceeding further and creating a jwt token
      if (isPassValid) {
        const user = {
          _id: userExists._id,
          userName: `${userExists.firstName} ${userExists.lastName}`,
          email: userExists.email,
          role: userExists.role,
        };
        const accessToken = signedJWT(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_KEY, {
          expiresIn: "15m",
        });
        // Updating refresh token in the database
        await UserCollection.updateOne(
          { email: req.body.email },
          { $set: { refreshToken: refreshToken } }
        );
        // setting up a cookie in the browser
        res.cookie("SSID", refreshToken, {
          httpOnly: true,
          path: "/refresh_token",
          sameSite: "none",
          secure: true,
        });
        // sending Access and Refresh Token
        res.json({ accessToken: accessToken, refreshToken: refreshToken });
        // else user has entered a wwrong password
      } else {
        res.status(401).json("Invalid password");
      }
      // Either user is not registered or Account was not activated
    } else {
      res.status(404).json("User not registered / Acct not activated");
    }
    // server errors
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

// ******** User logout ***************** //
// ******************************************** //

module.exports.logout = async (req, res) => {
  try {
    // deleting refreshtoken from the database
    await UserCollection.updateOne({}, { $unset: { refreshToken: 1 } });
    // clearing cookies from the browser
    res.clearCookie("SSID");
    // success message
    res.status(200).json({ message: "Logged out successfully" });
    // server errors
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

// ******** forgot password ***************** //
// ******************************************** //

module.exports.reset_password = async (req, res) => {
  try {
    const userExists = await UserCollection.findOne({ email: req.body.email });

    if (!userExists) return res.status(404).json("User not found");

    emailer(req.body.email);
    const userAuthentication = await UserCollection.updateOne(
      { email: req.body.email },
      { $set: { randomString: verificationString } }
    );

    if (userAuthentication)
      res.status(200).json("Check email for verification link");

    // Server errors
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

// ******** update password ***************** //
// ******************************************** //

module.exports.update_password = async (req, res) => {
  try {
    const validLink = await UserCollection.findOne({
      randomString: req.params.rs,
    }).select("randomString");

    if (!validLink) return res.status(401).json("Unauthorized Access");

    const password = req.body.password;
    // hashing user password
    const hashedPassword =
      password.length >= 6 ? await bcrypt.hash(password, 11) : "";

    const passwordUpdated = await UserCollection.updateOne(validLink, {
      $set: { password: hashedPassword },
    });

    if (passwordUpdated) {
      await UserCollection.updateOne(validLink, {
        $unset: { randomString: req.params.rs },
      });
      res.status(200).json("Password updated");
    }

    // Server errors
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

// ******** Display all users  ***************** //
// ******************************************** //

module.exports.display_users = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    const userData = await UserCollection.find(
      {},
      { _id: 0, password: 0, invoiceId: 0, refreshToken: 0, __v: 0 }
    );

    const userList = userData.filter((user) => {
      if (user.role !== "admin") return user;
    });

    res.status(200).json(userList);
    // server errors
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

// ******** Update users  ***************** //
// ******************************************** //

module.exports.update_users = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    // destructing form fields
    const {
      role,
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      gender,
      accountStatus,
    } = req.body;

    // hashing user password
    const hashedPassword =
      password.length >= 6 ? await bcrypt.hash(password, 11) : "";

    // submitting udpated information of the user to the database
    const userUpdated = await UserCollection.updateOne(
      { email: req.body.email },
      {
        $set: {
          role,
          firstName,
          lastName,
          password: hashedPassword,
          dateOfBirth,
          gender,
          accountStatus,
        },
      },
      { new: true }
    );

    if (!userUpdated) res.status(400).json("User could not be updated");
    // if above opertion is successful sends a green signal
    res.status(200).json("User updated successfully");

    // server errors
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

// ******** Delete users  ***************** //
// ******************************************** //

module.exports.delete_users = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    // submitting udpated information of the user to the database
    const userDeleted = await UserCollection.deleteOne({
      email: req.body.email,
    });

    if (!userDeleted) res.status(400).json("User could not be deleted");
    // if above opertion is successful sends a green signal
    res.status(200).json("User deleted successfully");

    // server errors
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};
