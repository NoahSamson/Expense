import mongoose from "mongoose";
import User from './user.js';

const expenseSchema = mongoose.Schema({
    expenseName: {type: String, required: true},
    addedDate: {type: Date},
    totalAmount: {type: Number, required: true},
    notes: {type: String},
    archive: {type: Boolean, default:false},
    category: {type: String},
    userId: {  type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Expense", expenseSchema);