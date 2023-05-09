import mongoose from "mongoose";
import Expense from "./expenses.js";

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number},
  dob: { type: Date },
  addressLineOne: { type: String },
  addressLineTwo: { type: String },
  city: { type: String },
  country: { type: String },
  salaryTotal: { type: Number },
  profile: { type: String },

  // because of using google login
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String, required: false },

  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
});

export default mongoose.model("User", userSchema);
