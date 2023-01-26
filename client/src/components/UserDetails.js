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
      <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-90" >User Details</h1>
      {!loaded ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 -mt-6">
        <p className="bg-gray-300 w-[60%] text-center p-5">
        <p>Username: <br /> <p className="font-bold">{user.username}</p></p>
        <p>Email:<br />   <p className="font-bold">{user.email}</p></p>
        </p>
      </div>
      )}
      {logged && (logged._id === user._id || logged.type === "admin") && (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 -mt-20">
        <button className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <Link to={`/users/${user._id}/edit`}>Edit profile</Link>
        </button> 
      </div>
      )}
    </div>
  );
}
