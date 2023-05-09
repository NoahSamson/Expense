import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import avatar from "../assets/profile.png";
import { toast,Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidate } from "../helper/validate";
import convertToBase64 from "../helper/convert";
import moment from 'moment';

import styles from "../styles/Username.module.css";
import { userContext } from "../userContext";
import { updateUser } from "../helper/helper";

function Profile() {
  
  const [file, setFile] = useState();
  const user = useContext(userContext) || {};
  console.log(user.firstName);
  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName ||"",
      age: user?.age ||"",
      dob: moment(user?.dob).format('YYYY-MM-DD') ||"",
      email: user?.email ||"",
      addressLineOne: user?.addressLineOne ||"",
      addressLineTwo: user?.addressLineTwo ||"",
      city: user?.city ||"",
      country: user?.country ||"",
      // password: "",
      // confirmPassword: "",
      // firstName: "",
      // lastName: "",
      // age: "",
      // dob: "",
      // email: "",
      // addressLineOne: "",
      // addressLineTwo: "",
      // city: "",
      // country: "",
      // password: "",
      // confirmPassword: "",
    },
    enableReinitialize: true,
    // validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || user?.data.profile});
      console.log(values);
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: "Updating...",
        success: <b>Profile Updated Successfully</b>,
        error: (error) => {
          if (error.response && error.response.data) {
            return <b>{error.response.data.message}</b>;
          } else {
            return <b>Could not Login</b>;
          }
        },
      });
    },
  });

  /** formik doesn't support file upload so we need to create this handler */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="conatiner mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="flex gap-6">
              <div className="left">
                <div className="title flex flex-col items-center">
                  <h4 className="text-5xl font-bold">Create an Account</h4>
                  <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                    Get started with your free account
                  </span>
                </div>
                <div className="profile flex justify-center py-4">
                  <label htmlFor="profile">
                    <img
                      src={user?.profile || file || avatar}
                      className={styles.profile_img}
                      alt="Avatar"
                    />
                  </label>
                  <input
                    type="file"
                    id="profile"
                    name="profile"
                    onChange={onUpload}
                  />
                </div>
                <div className="emailDiv textbox flex flex-col items-center">
                  <label htmlFor="personal" className="text-lg text-gray-500">
                    Email
                  </label>
                </div>
                <div className="textbox flex flex-col items-center py-4">
                  <input
                    {...formik.getFieldProps("email")}
                    className={styles.textbox}
                    type="email"
                    placeholder="Email Address"
                    readOnly={true}
                  />
                </div>
                <div className="passwordDiv textbox flex flex-col items-center">
                  <label htmlFor="personal" className="text-lg text-gray-500">
                    Password
                  </label>
                  <p className="text-gray-600 text-xs italic">
                    Make it as long and as crazy as you'd like
                  </p>
                  <div className="textbox flex gap-6 py-4">
                    <input
                      {...formik.getFieldProps("password")}
                      className={styles.textbox}
                      type="password"
                      placeholder="Password"
                      readOnly={true}
                    />
                    <input
                      {...formik.getFieldProps("confirmPassword")}
                      className={styles.textbox}
                      type="password"
                      placeholder="Confirm Password"
                      readOnly={true}
                    />
                  </div>
                </div>
              </div>
              <div className="right">
                <div className="NameDiv text-center pt-4">
                  <label htmlFor="personal" className="text-lg text-gray-500">
                    Name
                  </label>
                  <div className="textbox flex gap-6 pt-4">
                    <input
                      {...formik.getFieldProps("firstName")}
                      className={styles.textbox}
                      type="text"
                      placeholder="First Name"
                      required
                    />
                    <input
                      {...formik.getFieldProps("lastName")}
                      className={styles.textbox}
                      type="text"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>
                <div className="dobDiv text-center pt-4">
                  <label htmlFor="personal" className="text-lg text-gray-500">
                    Date of Birth
                  </label>
                  <div className="textbox flex gap-6 py-4">
                    <input
                      {...formik.getFieldProps("age")}
                      className={styles.textbox}
                      type="text"
                      placeholder="Age"
                      required
                    />
                    <input
                      {...formik.getFieldProps("dob")}
                      className={styles.textbox}
                      type="date"
                      placeholder="Date of Birth"
                      required
                    />
                  </div>
                </div>

                <div className="textbox flex flex-col items-center gap-6 py-4">
                  <label htmlFor="address" className="text-lg text-gray-500">
                    Address
                  </label>
                  <div className="flex gap-6">
                    <input
                      {...formik.getFieldProps("addressLineOne")}
                      className={styles.textbox}
                      type="text"
                      placeholder="Address Line 1"
                      required
                    />
                    <input
                      {...formik.getFieldProps("addressLineTwo")}
                      className={styles.textbox}
                      type="text"
                      placeholder="Address Line 2"
                      required
                    />
                  </div>
                  <div className="flex gap-6">
                    <input
                      {...formik.getFieldProps("city")}
                      className={styles.textbox}
                      type="text"
                      placeholder="City"
                      required
                    />
                    <input
                      {...formik.getFieldProps("country")}
                      className={styles.textbox}
                      type="text"
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center max-w-">
              <button type="submit" className={styles.btn}>
                Update
              </button>
            </div>
            <br />
            {/* <div className="text-center py-4">
              <span className="text-gray-500">
                Already a Member ?{" "}
                <Link className="text-red-500 font-bold" to="/login">
                  Login
                </Link>
              </span>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
