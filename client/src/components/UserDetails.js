import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loggedContext } from "../App";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function UserDetails() {
  const logged = useContext(loggedContext);

  const { id } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(
    fetch(`http://localhost:5000/getuser/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setLoaded(true);
        return data;
      })
  );

  useEffect(() => {
    fetch(`http://localhost:5000/getuser/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setLoaded(true);
        setUser(data);
      });
  }, [id]);

  return (
    <div>
      <h1>User Details</h1>
      {!loaded ? (
        <p>Loading...</p>
      ) : (
        <p>
          Username: {user.username}
          <br />
          Email: {user.email}
          <br />
        </p>
      )}
      {logged && (logged._id === user._id || logged.type === "admin") && (
        <button>
          <Link to={`/users/${user._id}/edit`}>Edit your profile</Link>
        </button>
      )}
    </div>
  );
}
