import React, { useState } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";

const RegisterPanel = () => {
  const [registerMsg, setRegisterMsg] = useState("");

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Required";
    }
    if (!values.password) {
      errors.password = "Required";
    }
    if (!values.email) {
      errors.email = "Required";
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
    <form onSubmit={formik.handleSubmit}>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      <br />
      {formik.errors.email ? <div>{formik.errors.email}</div> : <br />}
      <input
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        onChange={formik.handleChange}
        value={formik.values.username}
      />
      <br />
      {formik.errors.username ? <div>{formik.errors.username}</div> : <br />}
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      <br />
      {formik.errors.password ? <div>{formik.errors.password}</div> : <br />}
      <button type="submit">Submit</button>
      <br />
      <br />
      <div>{registerMsg}</div>
      <Link to="/login">Back to login</Link>
    </form>
  );
};

export default RegisterPanel;
