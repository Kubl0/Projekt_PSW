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
      <h1 className="text-3xl font-bold text-center mb-3">Users</h1>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-row justify-center"
      >
        <input
          className="w-[451px] mr-2 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          id="search"
          name="search"
          type="text"
          placeholder="Search"
          onChange={formik.handleChange}
          value={formik.values.search}
        />
        <button
          type="submit"
          className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Search
        </button>
      </form>
      <ul className="flex flex-col items-center mt-0">
        {users.map((user) => (
          <li key={user._id} className="mt-7">
            <UserInfo user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
