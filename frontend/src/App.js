import "./App.css";
import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Routes,
  Route,
  Router,
} from "react-router-dom";

import { userContext } from "./userContext";
import { useEffect, useState } from "react";

import Register from "./components/Register";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Expenses from "./components/Expenses";

import Dashboard from "./components/Dashboard";

import PageNotFound from "./components/PageNotFound";
import { getUser } from "./helper/helper";
import { useNavigate } from "react-router-dom";

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/" element={<Dashboard/>}>
//         <Route path="profile" />
//         <Route path="expenses" />
//       </Route>
//     </Routes>
//   )
// );

// const router = createBrowserRouter([
//   {
//     path: '/login',
//     element: <Login />
//   },
//   {
//     path: '/register',
//     element: <Register />
//   },
//   {
//     path: '/Dashboard',
//     element: <Dashboard/>
//   }
// ])

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Expenses />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
  )
);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log(localStorage.getItem("isLoggedIn"))
    // if (localStorage.getItem("isLoggedIn") === true) {
      let userPromise = getUser();

      try {
        userPromise.then((res) => {
            setUser(res.data);
        });
      } catch (error) {
        console.error(error);
      }
    // } else {
    //   setUser({});
    // }
  }, [setUser]);

  console.log(user);
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Dashboard />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/register" element={<Register />} />
    //     <Route path="*" element={<PageNotFound />} />
    //   </Routes>
    // </Router>
    <userContext.Provider value={user}>
      <main>
        <RouterProvider router={router}></RouterProvider>
      </main>
    </userContext.Provider>
  );
}

export default App;
