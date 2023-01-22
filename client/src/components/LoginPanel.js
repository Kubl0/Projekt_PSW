import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { loggedContext } from "../App";
import { useContext } from "react";

const LoginPanel = ({ setUser }) => {
  const [loginMsg, setLoginMsg] = useState("");

  const logged = useContext(loggedContext);

  const navigate = useNavigate();
  //eslint-disable-next-line
  const [cookie, setCookie] = useCookies("user");

  const handleCookie = (user) => {
    //expiry in 5 minutes
    let time = new Date();
    time.setMinutes(time.getMinutes() + 5);
    setCookie("user", user, { path: "/", expires: time });
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      if (values.username !== "" || values.password !== "") {
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
            });
          }
        });
        formik.resetForm();
      }
    },
  });

  useEffect(() => {
    if (logged !== null) logged.username && navigate("/home");
  }, [logged, navigate]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        onChange={formik.handleChange}
        value={formik.values.username}
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      <button type="submit">Submit</button>
      <br />
      <br />
      <div>{loginMsg}</div>
      <br />
      <Link to="/register">Register</Link>
    </form>
  );
};

export default LoginPanel;
