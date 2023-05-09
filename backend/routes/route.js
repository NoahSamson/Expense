import express from "express";

const router = express.Router();
import { auth } from "../middleware/auth.js";
import * as controller from "../controllers/appController.js";

router.post("/register", controller.signup);
router.post("/login", controller.signin);

router.get("/user", auth, controller.getUser);
// router.put("/user/update/:id", controller.updateUser);
router.put("/user/update", auth, controller.updateUser);

// router.post("/user/:id/createExpense", controller.createExpense);
router.post("/user/createExpense", auth, controller.createExpense);
router.put("/user/updateExpense/:expenseId", controller.updateExpense);
router.get("/user/:id/getExpense/:expenseId", controller.getExpense);
// router.get("/user/:id/getAllExpenses", controller.getAllExpenses);
router.get("/user/getAllExpenses", auth, controller.getAllExpenses);
// router.delete("/user/:id/deleteExpense/:expenseId", controller.deleteExpense);
router.delete("/user/deleteExpense/:expenseId", auth, controller.deleteExpense);

export default router;