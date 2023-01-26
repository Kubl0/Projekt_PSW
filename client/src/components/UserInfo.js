import React from "react";
import { Link } from "react-router-dom";

export default function UserInfo({ user }) {
  return (
    <div className="bg-gray-400 w-[350px] p-3 flex flex-col text-center rounded-xl">
      <br />
      <p>Username: <br /> <p className="font-bold">{user.username}</p></p>
      <p>Email:<br />   <p className="font-bold">{user.email}</p></p>
      <br />
      <button>
        <Link className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" to={`/users/${user._id}/details`}>Details</Link>
      </button>
    </div>
  );
}
