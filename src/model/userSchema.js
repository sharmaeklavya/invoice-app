const mongoose = require("mongoose");
const { isEmail } = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  role: {
    type: String,
    trim: true,
    enum: ["admin", "manager", "executive"],
    required: [true, , "Please select a user role"],
  },
  firstName: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, "Please enter first name"],
  },
  lastName: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, "Please enter last name"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: [true, "User email already exists"],
    validate: [isEmail, "Please enter a valid email"],
    required: [true, "Please enter your email"],
  },
  password: {
    type: String,
    trim: true,
    minLength: [6, "Password should not be less than 6 characters"],
    required: [true, "Please enter a password"],
  },
  dateOfBirth: {
    type: Date,
    trim: true,
    required: [true, "Please enter a valid DOB"],
  },
  gender: {
    type: String,
    trim: true,
    enum: ["she", "he", "they"],
    required: [true, "Please select a gender"],
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  accountStatus: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    trim: true,
  },
  invoiceId: [{ inId: { type: mongoose.Types.ObjectId } }],
  randomString: { type: String },
});

const UserCollection = mongoose.model("users", userSchema);

module.exports = UserCollection;
