import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ENV from "../config.js";

import UserModel from "../models/user.js";
import ExpenseModel from "../models/expenses.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModel.findOne({ email });
    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exists" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id },
      ENV.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res
      .status(200)
      .json({ message: "User Logged In Successfully", result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const signup = async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    dob,
    addressLineOne,
    addressLineTwo,
    city,
    country,
    salaryTotal,
    profile,
    age,
  } = req.body;

  try {
    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      dob,
      addressLineOne,
      addressLineTwo,
      city,
      country,
      salaryTotal,
      age,
      profile: profile || "",
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      ENV.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res
      .status(201)
      .json({ message: "User Registered Successfully", result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  // const userId = req.params.id;
  const userId = req.id;
  console.log(userId);
  try {
    const result = await UserModel.findById(userId);

    if (!result) return res.status(501).json({ error: "Couldn't find User" });
    console.log(result);
    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  // const userId = req.params.id;
  const userId = req.id;
  try {
    if (userId) {
      const body = req.body;

      const result = await UserModel.updateOne({ _id: userId }, body);
      if (!result)
        return res.status(501).json({ error: "Couldn't Update User" });

      return res.status(201).json({ message: "User Updated" });
    } else {
      return res.status(401).json({ error: "User not found!" });
    }
  } catch (error) {
    return res.status(401).json(error);
  }
};

// export const getAllExpenses = async (req, res) => {
//   const userId = req.params.id;
//   console.log(userId);
//   try {
//     const result = await UserModel.findOne({ _id: userId });

//     if (!result)
//       return res.status(501).json({ error: "Couldn't find Expense" });

//     return res.status(201).json(result.expenses);
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong" });
//     console.log(error);
//   }
// };

export const getAllExpenses = async (req, res) => {
  // const userId = req.params.id;
  const userId = req.id;
  console.log(userId);
  try {
    const result = await ExpenseModel.find({ userId });
    console.log(result);
    if (!result)
      return res.status(501).json({ error: "Couldn't find Expense" });

    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const createExpense = async (req, res) => {
  // const userId = req.params.id;
  const userId = req.id;
  console.log(userId);
  const { expenseName, addedDate, totalAmount, notes, archive, category } = req.body;

  try {
    const newExpense = new ExpenseModel({
      expenseName,
      addedDate,
      totalAmount,
      notes,
      archive,
      category,
      userId
    });

    newExpense.save().then((expense, err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error saving expense to database" });
      } else {
        UserModel.findById(userId).then((user, err) => {
          if (err) {
            res.status(500).json("Error finding User");
          } else {
            user.expenses.push(expense._id);
            user.save().then((updatedUser, err) => {
              if (err) {
                res.status(500).json("Error updating user");
              } else {
                console.log("User updated with new expense:", updatedUser);
                res.status(200).json("expense Updated");
              }
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const updateExpense = async (req, res) => {
  const expenseId = req.params.expenseId;
  console.log(expenseId);
  try {
    if (expenseId) {
      const body = req.body;

      const result = await ExpenseModel.updateOne({ _id: expenseId }, body);
      if (!result)
        return res.status(501).json({ error: "Couldn't Update Expense" });

      return res.status(201).json({ message: "Expense Updated" });
    } else {
      return res.status(401).json({ error: "Expense not found!" });
    }
  } catch (error) {
    return res.status(401).json(error);
  }
};

export const getExpense = async (req, res) => {
  // const userId = req.params.id;
  const expenseId = req.params.expenseId;
  console.log(expenseId);
  try {
    const result = await ExpenseModel.findOne({ _id: expenseId });

    if (!result)
      return res.status(501).json({ error: "Couldn't find Expense" });

    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const deleteExpense = async (req, res) => {
  console.log(req.params.id);
  const userId = req.params.id;
  const expenseId = req.params.expenseId;

  try {
    await ExpenseModel.findByIdAndDelete(expenseId).then((expense) => {
      if (!expense) {
        res.status(500).json({ message: "Error deleting expense" });
      }
    });

    await UserModel.findByIdAndUpdate(userId, {
      $pull: { expenses: expenseId },
    }).then((user) => {
      if (!user) {
        res.status(500).json({ message: "Error updating user" });
      }
    });
    res.status(200).json("Expense Deleted");
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
