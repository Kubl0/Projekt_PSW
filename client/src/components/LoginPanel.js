import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { loggedContext } from "../App";
import { useContext } from "react";
import "../style.css";

const LoginPanel = ({ setUser }) => {
  const [loginMsg, setLoginMsg] = useState("");

  const logged = useContext(loggedContext);

  const navigate = useNavigate();
  //eslint-disable-next-line
  const [cookie, setCookie] = useCookies("user");

  const handleCookie = (user) => {
    //expiry in 5 minutes
    let time = new Date();
    time.setMinutes(time.getMinutes() + 20);
    setCookie("user", user, { path: "/", expires: time });
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
        fetch("http://localhost:5000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.username,
            password: values.password,
          }),
        }).then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              setLoginMsg(data.message);
              if (data.message === "Login successful") {
                setUser(data.user);
                handleCookie(data.user);
                navigate("/home");
              }
              else{
                setLoginMsg(data.message);
              }
            });
          }
        });
        formik.resetForm();
      }
  });

  useEffect(() => {
    if (logged !== null) logged.username && navigate("/home");
  }, [logged, navigate]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-90 mt-[150px]">Sign in to your account</h2>
      <p className="mt-2 text-center text-sm text-gray-600">or <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">register</Link></p>
    <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px flex flex-col">
      <input
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        onChange={formik.handleChange}
        value={formik.values.username}
        className="w-[451px]  justify-center relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        onChange={formik.handleChange}
        value={formik.values.password}
        className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"

      />
      </div>
      <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
            </svg>
          </span>
          Sign in
        </button>
        <p className="text-center text-red-400 font-semibold">{loginMsg}</p>

    </form>
    </div>
  );
};

export default LoginPanel;
