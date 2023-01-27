import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

export default function GameRoom() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      room: "",
    },
    onSubmit: (values) => {
      if (values.room !== "") {
        navigate(`/gameroom/${values.room}`);
        fetch("http://localhost:5000/addgameroom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room: values.room,
          }),
        });
      }
    },
  });

  return (
    <div>
      <h1 className="mt-[200px] text-center text-3xl font-bold tracking-tight text-gray-90 -mt-[15px]">
        GameRoom
      </h1>
      <div className="mt-[10px] flex flex-col items-center">
        <form onSubmit={formik.handleSubmit} className="flex flex-col w-[50%]">
          <input
            className="text-center mt-2 border-2 border-gray-600 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
            id="room"
            name="room"
            type="text"
            placeholder="Room"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.room}
          />
          <button
            type="submit"
            className="mt-[10px] group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
