import React, { useContext, useState, useEffect } from "react";

import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import moment from "moment";
import { userContext } from "../userContext";
import {
  getAllExpense,
  updateUser,
  updateExpense,
  deleteExpense,
  createExpense,
} from "../helper/helper";

import "../styles/expense.css";

function Expenses() {
  const { user, setUser } = useContext(userContext) || {};

  const [allExpenseData, setAllExpenseData] = useState([]);
  const [newExpense, setNewExpense] = useState({
    archive: false,
    expenseName: "",
    addedDate: "",
    totalAmount: "",
    category: "",
    notes: "",
  });
  const [salary, setSalary] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    let allExpensesPromise = getAllExpense();

    try {
      allExpensesPromise.then((res) => {
        setAllExpenseData(res?.data);
      });
    } catch (error) {
      console.error(error);
    }
  }, [setAllExpenseData]);

  useEffect(() => {
    if (salary !== 0 && allExpenseData.length > 0) {
      const totalAmount = allExpenseData.reduce(
        (accumulator, expense) => accumulator + expense.totalAmount,
        0
      );
      const newBalance = salary - totalAmount;
      setBalance(newBalance);
    }
  }, [salary, allExpenseData]);

  const onBlurInput = async (event, index) => {
    const { name, value, type, checked } = event.target;
    console.log(name);
    console.log(value);
    console.log(checked);
    console.log(type);
    console.log(allExpenseData[index]._id);

    const updatedExpense = {
      ...allExpenseData[index],
      [name]: type === "checkbox" ? checked : value,
    };

    const newExpenseData = [...allExpenseData];
    newExpenseData[index] = updatedExpense;
    console.log(newExpenseData);
    setAllExpenseData(newExpenseData);
    try {
      let updateExpensePromise = updateExpense(
        updatedExpense,
        allExpenseData[index]._id
      );
      toast.promise(updateExpensePromise, {
        loading: "Updating",
        success: <b>Updated</b>,
        error: (error) => {
          if (error.response && error.response.data) {
            return <b>{error.response.data.message}</b>;
          } else {
            return <b>Could not Update</b>;
          }
        },
      });
    } catch (error) {}
  };

  const handleCreateExpense = async () => {
    console.log(newExpense);

    let createExpensePromise = createExpense(newExpense);
    toast.promise(createExpensePromise, {
      loading: "Creating...",
      success: <b>Expense Created Successfully</b>,
      error: (error) => {
        if (error.response && error.response.data) {
          return <b>{error.response.data.message}</b>;
        } else {
          return <b>Couldn't Create Expense</b>;
        }
      },
    });

    setAllExpenseData([...allExpenseData, newExpense]);
    setNewExpense({
      archive: false,
      expenseName: "",
      addedDate: "",
      totalAmount: "",
      category: "",
      notes: "",
    });
  };

  const exportCSV = () => {
    const items = allExpenseData;
    const replacer = (key, value) => (value === null ? "" : value); // Replace null values with an empty string
    const header = Object.keys(items[0]);
    const csv = [
      header.join(","),
      ...items.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expense-data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleDeleteExpense = async (expenseId, index) => {
    let deletePromise = deleteExpense(expenseId);
    toast.promise(deletePromise, {
      loading: "deleting",
      success: <b>Deleted Expense Successfully</b>,
      error: (error) => {
        if (error.response && error.response.data) {
          return <b>{error.response.data.message}</b>;
        } else {
          return <b>Could not Login</b>;
        }
      },
    });

    const updatedAllExpenseData = allExpenseData.filter(
      (expense) => expense._id !== expenseId
    );
    setAllExpenseData(updatedAllExpenseData);
    // if (user && user.data && user.data.expenses) {
    //   const newExpenses = user.data.expenses.filter(
    //     (expense) => expense._id !== expenseId
    //   );
    //   const updatedUser = {
    //     ...user.data,
    //     expenses: newExpenses,
    //   };
    //   setUser(updatedUser);
    //
    // }
  };

  return (
    <div className="containerExpense mx-auto flex flex-col">
      <div className="expense-form flex justify-around">
        <div className="salaryEnter">
          <label for="salary">Salary:</label>
          <input
            defaultValue={salary}
            type="number"
            id="salary"
            name="salary"
            onBlur={(event) => setSalary(event.target.value)}
          />
        </div>
        <div className="salaryDisplay">Account Balance = {balance}</div>
      </div>
      <div>
        <button
          type="button"
          onClick={exportCSV}
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Export
        </button>
      </div>
      <div className="expense-table">
        <table>
          <thead>
            <tr>
              <th>Archived</th>
              <th>Expense</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Category</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  name="archive"
                  defaultChecked={newExpense.archive}
                  onBlur={(event) =>
                    setNewExpense({
                      ...newExpense,
                      archive: event.target.checked,
                    })
                  }
                  type="checkbox"
                  placeholder=""
                />
              </td>
              <td>
                <input
                  name="expenseName"
                  defaultValue={newExpense.expenseName}
                  onBlur={(event) =>
                    setNewExpense({
                      ...newExpense,
                      expenseName: event.target.value,
                    })
                  }
                  type="text"
                  placeholder=""
                />
              </td>
              <td>
                <input
                  name="addedDate"
                  defaultValue={newExpense.addedDate}
                  onBlur={(event) =>
                    setNewExpense({
                      ...newExpense,
                      addedDate: event.target.value,
                    })
                  }
                  type="date"
                  placeholder=""
                />
              </td>
              <td>
                <input
                  name="totalAmount"
                  defaultValue={newExpense.totalAmount}
                  onBlur={(event) =>
                    setNewExpense({
                      ...newExpense,
                      totalAmount: event.target.value,
                    })
                  }
                  type="number"
                  placeholder=""
                />
              </td>
              <td>
                <input
                  name="category"
                  defaultValue={newExpense.category}
                  onBlur={(event) =>
                    setNewExpense({
                      ...newExpense,
                      category: event.target.value,
                    })
                  }
                  type="text"
                  placeholder=""
                />
              </td>
              <td>
                <input
                  name="notes"
                  defaultValue={newExpense.notes}
                  onBlur={(event) =>
                    setNewExpense({ ...newExpense, notes: event.target.value })
                  }
                  type="text"
                  placeholder=""
                />
              </td>
              <td>
                <button
                  type="button"
                  onClick={handleCreateExpense}
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900"
                >
                  Create
                </button>
              </td>
            </tr>
            {allExpenseData &&
              allExpenseData.map((expense, index) => (
                <tr key={index}>
                  <td>
                    <input
                      name="archive"
                      defaultChecked={expense.archive}
                      type="checkbox"
                      onBlur={(event) => onBlurInput(event, index)}
                      placeholder=""
                    />
                  </td>
                  <td>
                    <input
                      name="expenseName"
                      defaultValue={expense.expenseName}
                      type="text"
                      onBlur={(event) => onBlurInput(event, index)}
                      placeholder=""
                      disabled={expense.archive}
                    />
                  </td>
                  <td>
                    <input
                      name="addedDate"
                      defaultValue={moment(expense.addedDate).format(
                        "YYYY-MM-DD"
                      )}
                      type="date"
                      onBlur={(event) => onBlurInput(event, index)}
                      placeholder=""
                      disabled={expense.archive}
                    />
                  </td>
                  <td>
                    <input
                      name="totalAmount"
                      defaultValue={expense.totalAmount}
                      type="text"
                      onBlur={(event) => onBlurInput(event, index)}
                      placeholder=""
                      disabled={expense.archive}
                    />
                  </td>

                  <td>
                    <input
                      name="category"
                      defaultValue={expense.category}
                      type="text"
                      onBlur={(event) => onBlurInput(event, index)}
                      placeholder=""
                      disabled={expense.archive}
                    />
                  </td>
                  <td>
                    <input
                      name="notes"
                      defaultValue={expense.notes}
                      type="text"
                      onBlur={(event) => onBlurInput(event, index)}
                      placeholder=""
                      disabled={expense.archive}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteExpense(expense._id, index)}
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expenses;
