import React from "react";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { loginValidate } from "../helper/validate";
import { loginUser } from "../helper/helper";

// import useFetch from "../hooks/fetch.hook";

import styles from "../styles/Username.module.css";

function Login() {
  const navigate = useNavigate();
  // const [ {isLoading, apiData, serverError }] = useFetch(`/login`);

  const formik = useFormik({
    initialValues: {
      email: "test3@gmail.com",
      password: "123457",
    },
    validate: loginValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = loginUser({
        email: values.email,
        password: values.password,
      });
      toast.promise(loginPromise, {
        loading: "Checking...",
        success: <b>Logged In Successfully</b>,
        error: (error) => {
          if (error.response && error.response.data) {
            return <b>{error.response.data.message}</b>;
          } else {
            return <b>Could not Login</b>;
          }
        },
      });

      try {
        await loginPromise.then((res) => {
          let { token } = res.data;
          localStorage.setItem("token", token);
          localStorage.setItem("isLoggedIn", true);
          navigate("/dashboard/profile");
        });
      } catch (error) {
        console.error(error);
        toast.error(
          "An error occurred while Logging In. Please try again later."
        );
      }
    },
  });

  // if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  // if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello Again</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore More with by connecting with Us
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} className={styles.profile_img} alt="Avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("email")}
                className={styles.textbox}
                type="email"
                placeholder="Username"
              />
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="password"
                placeholder="Password"
              />
              <button type="submit" className={styles.btn}>
                Login
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a Member ?{" "}
                <Link className="text-red-500 font-bold" to="/register">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
