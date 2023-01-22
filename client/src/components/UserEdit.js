import React from "react";
import { loggedContext } from "../App";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";

export default function UserEdit({ logout }) {
  const logged = useContext(loggedContext);
  const { id } = useParams();
  const [editMsg, setEditMsg] = React.useState("");
  const [user, setUser] = React.useState({});

  React.useEffect(() => {
    fetch(`http://localhost:5000/getuser/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  }, [id]);

  const formik = useFormik({
    initialValues: {
      username: user.username,
      email: user.email,
      password: user.password,
    },
    onSubmit: (values) => {
      fetch(`http://localhost:5000/updateuser/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username ? values.username : user.username,
          email: values.email ? values.email : user.email,
          password: values.password ? values.password : user.password,
        }),
      }).then((res) => {
        if (res.status === 200) {
          setEditMsg("User edited successfully");
          logout();
        } else {
          setEditMsg("User edit failed");
        }
      });
      formik.resetForm();
    },
  });

  if (logged && logged._id === id) {
    return (
      <div>
        <h1>Edit your profile</h1>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <input
            type="text"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <button type="submit">Submit</button>
        </form>
        <br />
        <button
          onClick={() => {
            fetch(`http://localhost:5000/deleteuser/${id}`, {
              method: "DELETE",
            }).then((res) => {
              if (res.status === 200) {
                setEditMsg("User deleted successfully");
              } else {
                setEditMsg("User delete failed");
              }
            });
          }}
        >
          Delete account
        </button>
        <br />
        <h3>{editMsg}</h3>
      </div>
    );
  } else {
    return (
      <div>
        <h1>You are not authorized to edit this user.</h1>
      </div>
    );
  }
}
