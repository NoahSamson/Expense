import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** Authenticate */
export async function authenticate(email) {
  try {
    return await axios.post("./api/authenticate", { email });
  } catch (error) {
    return { error: "Email doesn't exist" };
  }
}

/**register User function */
export async function registerUser(creds) {
  try {
    const { data } = await axios.post(
      `http://localhost:5000/api/register`,
      creds
    );

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/**Login function */
export async function loginUser({ email, password }) {
  try {
    // if(email) {
    const { data } = await axios.post("http://localhost:5000/api/login", {
      email,
      password,
    });

    return Promise.resolve({ data });
    // }
  } catch (error) {
    return Promise.reject({ error });
  }
}

/**Update User Profile */
export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put(
      "http://localhost:5000/api/user/update",
      response,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject("Couldn't update User");
  }
}

/** create Expense */
export async function createExpense(response) {
  try {
    const token = await localStorage.getItem("token");
    console.log(token);

    const data = await axios.post(
      `http://localhost:5000/api/user/createExpense`,
      response,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // return data;
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject("Couldn't Create Expense");
    // return {error: "Couldn't Create Expense"}
  }
}

/** Update Expense */
export async function updateExpense(response, expenseId) {
  try {
    const data = await axios.put(
      `http://localhost:5000/api/user/updateExpense/${expenseId}`,
      response
    );
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject("Couldn't Update Expense");
  }
}

/** get User Details */
export async function getUser() {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.get(`http://localhost:5000/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(data);
    // return data;
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject("User doesn't Exist");
    // return { error: "User doesn't Exist" };
  }
}

/** get All Expense */
export async function getAllExpense() {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.get(
      `http://localhost:5000/api/user/getAllExpenses`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(data);
    // return data;
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject("Couldn't get all expenses");
    // return { error: "Couldn't get all expenses" };
  }
}

/** delete Expense */
export async function deleteExpense(expenseId) {
    console.log(expenseId);
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    const data = await axios.delete(
      `http://localhost:5000/api/user/deleteExpense/${expenseId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
    // return Promise.resolve(data);
  } catch (error) {
    // return Promise.reject("Couldn't Delete Expense");
    return {error: "Couldn't Delete Expense"};
  }
}

// export async function getUser({ id }) {
//     try{
//         const { data } = await axios.get(`/api/user/${id}`);
//         return { data };
//     } catch (error) {
//         return {error: "User doesn't Exist"};
//     }
// }
