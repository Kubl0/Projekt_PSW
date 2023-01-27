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
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start bg-gray-800 p-3 pl-12 pr-12">
          <Link to="/home">
            <button className="bg-gray-700 text-white px-3 h-8 mt-2 rounded-md text-sm font-medium mr-3">
              Home
            </button>
          </Link>
          <Link to="/users">
            <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 h-8 mt-2 mr-3 rounded-md text-sm font-medium">
              Users
            </button>
          </Link>
          <Link to="mqtt">
            <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 h-8 mt-2 mr-3 rounded-md text-sm font-medium">
              Chat
            </button>
          </Link>
          <div className="flex grow"></div>
          <Link to={`users/${logged._id}/details`}>
            <button className="">
              <h2 className="text-gray-300 font-medium mt-[5px] mr-5 flex flex-row">
                <img
                  src={logged.image}
                  className="w-10 h-10 rounded-full"
                  alt="..."
                />{" "}
              </h2>
            </button>
          </Link>
          <button
            className="bg-gray-700 text-white px-3 py-0 rounded-md text-sm font-medium h-8 mt-2"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}
