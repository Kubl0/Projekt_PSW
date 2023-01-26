import React from "react";
import { useFormik } from "formik";
import { Navigate, useNavigate } from "react-router-dom";

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
      <h1>GameRoom</h1>
      Wybierz pokój:
      <form onSubmit={formik.handleSubmit}>
        <input
          id="room"
          name="room"
          type="text"
          placeholder="Room"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.room}
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
}
