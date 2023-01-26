import React, { useState } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";

const RegisterPanel = () => {
  const [registerMsg, setRegisterMsg] = useState("");

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Username required";
    }
    if (!values.password) {
      errors.password = "Password required";
    }
    if (!values.email) {
      errors.email = "Email required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
    },
    validate,
    onSubmit: (values) => {
      if (
        values.username !== "" ||
        values.password !== "" ||
        values.email !== ""
      ) {
        fetch("http://localhost:5000/adduser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.username,
            password: values.password,
            email: values.email,
            type: "user",
          }),
        }).then((res) => {
          if (res.status === 200) {
            setRegisterMsg("User registered successfully");
          } else {
            setRegisterMsg("User registration failed");
          }
        });
        formik.resetForm();
      }
    },
  });
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-90 mt-[150px]">Register new account</h2>
    <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-md shadow-md -space-y-px flex flex-col">
      <input
      className="w-[451px]  justify-center relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />

      <input
      className="w-[450px]  justify-center relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        onChange={formik.handleChange}
        value={formik.values.username}
      />
      
      <input
       className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      </div>
      <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
            </svg>
          </span>
         Register
        </button>
      <div>
      {formik.errors.email ? <div className="text-center text-red-400 font-semibold">{formik.errors.email}</div> : <br />}
      {formik.errors.username ? <div className="text-center text-red-400 font-semibold">{formik.errors.username}</div> : <br />}
      {formik.errors.password ? <div className="text-center text-red-400 font-semibold" >{formik.errors.password}</div> : <br />}
      </div>
      
      <div>{registerMsg}</div>
      <br />
      <div className="flex flex-col text-center text-gray-500 text-sm justify-center items-center">
        <p className="mb-2 -mt-14">Already have an account?</p>
      <Link to="/login" className="center-group relative flex w-[200px] justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Back to login</Link>
      </div>
    </form>
    </div>
  );
};

export default RegisterPanel;
