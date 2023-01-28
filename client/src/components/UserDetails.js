import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loggedContext } from "../App";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import CommentList from "./CommentList";

export default function UserDetails() {
  const logged = useContext(loggedContext);

  const { id } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(false);
  const [comments, setComments] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: user.name,
      comment: "",
    },
    onSubmit: (values) => {
      fetch(`http://localhost:5000/addComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: logged._id,
          name: logged.username,
          userProfile: user._id,
          comment: values.comment,
          timestamp: Date.now(),
        }),
      });
      formik.resetForm();
      setUpdate(true);
    },
  });

  useEffect(() => {
    fetch(`http://localhost:5000/getuser/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setLoaded(true);
        setUser(data);
      });

    fetch(`http://localhost:5000/getComments/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
      });

    setUpdate(false);
  }, [id, update]);

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
      {loaded && (
        <div className="flex flex-col items-center">
          <div className=" w-[35%] bg-white rounded-lg border p-2 my-4 mx-6">
            <h3 className="font-bold">User comments</h3>

            <div className="flex flex-col">
              <CommentList comments={comments} key={Math.random()} />
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="w-full px-3 my-2">
                <textarea
                  className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                  name="comment"
                  required
                  placeholder="Type Your Comment"
                  onChange={formik.handleChange}
                  value={formik.values.comment}
                ></textarea>
              </div>

              <div className="w-full flex justify-end px-3">
                <input
                  type="submit"
                  className="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500"
                  value="Post Comment"
                ></input>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
