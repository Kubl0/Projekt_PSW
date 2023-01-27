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
      {!loaded ? (
        <p>Loading...</p>
      ) : (
        <div className="px-6 mt-10">
          <div className="flex flex-wrap justify-center">
            <div className="relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16">
              <div className="w-full flex justify-center">
                <div className="relative -ml-3">
                  <img
                    alt="..."
                    src={user.image}
                    className="shadow-xl rounded-full align-middle border-none absolute -m-16 lg:-ml-16 max-w-[150px]"
                  />
                  {logged &&
                    (logged._id === user._id || logged.type === "admin") && (
                      <div className="absolute top-3 left-9">
                        <Link to={`/users/${user._id}/edit`}>
                          <button className="group relative flex justify-center w-[40px] mt-9 rounded-full border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <p className="emoji">✏️</p>
                          </button>
                        </Link>
                      </div>
                    )}
                </div>
              </div>
              <div className="w-full text-center mt-20">
                <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                  <div className="p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">
                      {user.gamesPlayed}
                    </span>
                    <span className="text-sm text-slate-400">Games Played</span>
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">
                      {user.gamesWon}
                    </span>
                    <span className="text-sm text-slate-400">Games Won</span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1 ml-1">
                    {user.username}
                  </h3>
                </div>
                <div className="mt-6 py-6 border-t border-slate-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full px-4">
                      <p className="font-light leading-relaxed text-slate-600">
                        {user.profileDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
