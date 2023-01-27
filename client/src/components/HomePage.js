import React from "react";
import { useContext } from "react";
import { loggedContext } from "../App";
import { Link } from "react-router-dom";

const HomePage = () => {
  //eslint-disable-next-line
  const logged = useContext(loggedContext);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-90 -mt-[15px]">
        Home Page
      </h1>
      <p>
        <Link to="/gameroom">
          <button className="mt-4 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Start game room
          </button>
        </Link>
      </p>
    </div>
  );
};

export default HomePage;
