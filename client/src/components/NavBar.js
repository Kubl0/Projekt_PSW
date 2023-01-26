import React from "react";
import { useContext } from "react";
import { loggedContext } from "../App";
import { Link } from "react-router-dom";

export default function NavBar({ logout }) {
  const logged = useContext(loggedContext);

  const location = window.location.pathname;

  const [display, setDisplay] = React.useState(
    location !== "/login" ? true : false
  );

  React.useEffect(() => {
    setDisplay(location !== "/login" ? true : false);
  }, [location]);

  return (
    <>
      {display && logged && (
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start bg-gray-800 p-3 pl-12 pr-12 rounded-b-xl">
          <button className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium mr-3">
            <Link to="/home">Home</Link>
          </button>
          <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2  mr-3 rounded-md text-sm font-medium">
            <Link to="/users">Users</Link>
          </button>
          <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 mr-3 rounded-md text-sm font-medium">
            <Link to={`users/${logged._id}/details`}>Profile</Link>
          </button>
          <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2  mr-3 rounded-md text-sm font-medium">
            <Link to="mqtt">Chat</Link>
          </button>
          <div className="flex grow"></div>
          <h2 className="text-gray-300 font-medium mt-[5px] mr-5">Welcome {logged.username}</h2>
          <button className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium" 
          onClick={logout}>Logout</button>
        </div>
      )}
    </>
  );
}
