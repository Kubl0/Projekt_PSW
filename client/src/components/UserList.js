import React from "react";
import UserInfo from "./UserInfo";
import { useFormik } from "formik";

const UserList = () => {
  const [users, setUsers] = React.useState([]);
  const [search, setSearch] = React.useState("");

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: (values) => {
      setSearch(values.search);
    },
  });

  React.useEffect(() => {
    if (search === "") {
      fetch(`http://localhost:5000/getusers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
        });
    } else {
      fetch(`http://localhost:5000/getusers/${search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
        });
    }
  }, [search]);

  return (
    <div>
      <br />
      <form onSubmit={formik.handleSubmit}>
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search"
          onChange={formik.handleChange}
          value={formik.values.search}
        />
        <button type="submit">Search</button>
      </form>

      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <UserInfo user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
