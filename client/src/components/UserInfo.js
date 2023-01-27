import React from "react";
import { Link } from "react-router-dom";

export default function UserInfo({ user }) {
  return (
    <div className="w-[500px] bg-white border border-gray-900 shadow-lg  rounded-3xl p-4 m-4 flex flex-row">
      <img src={user.image} alt="user" className="rounded-full w-32 h-32" />
      <div className="flex-auto sm:ml-5 justify-evenly pt-6">
        <p className="flex-none text-lg text-gray-800 font-bold leading-none">
          {user.username}
        </p>
        <div className="flex-auto sm-5 mr-5 justify-evenly mt-5">
          <p className=" text-gray-400 text-sm">
            Zagrane gry: {user.gamesPlayed} | Wygrane gry: {user.gamesWon}
          </p>
        </div>
      </div>
      <br />
      <button>
        <Link
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm mt-[80px] font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          to={`/users/${user._id}/details`}
        >
          Details
        </Link>
      </button>
    </div>
  );
}
