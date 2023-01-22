import React from "react";
import { Link } from "react-router-dom";

export default function UserInfo({ user }) {
  return (
    <div>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <button>
        <Link to={`/users/${user._id}/details`}>Details</Link>
      </button>
    </div>
  );
}
