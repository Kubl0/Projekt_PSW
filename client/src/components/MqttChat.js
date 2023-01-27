import React, { useEffect } from "react";
import mqtt from "precompiled-mqtt";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { loggedContext } from "../App.js";
import { useContext } from "react";

export default function MqttChat() {
  const user = useContext(loggedContext);
  const [room, setRoom] = React.useState("");
  const [client, setClient] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [actualChat, setActualChat] = React.useState([]);
  const [id, setId] = React.useState(0);

  const formik1 = useFormik({
    initialValues: {
      room: "",
    },
    onSubmit: (values) => {
      if (values.room !== "") {
        setRoom(values.room);
        formik1.resetForm();
        setActualChat([]);
      }
    },
  });

  const formik2 = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: (values) => {
      if (values.message !== "") {
        client.publish(room, `${user.username}: ${values.message}`);
        fetch("http://localhost:5000/addchatmessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room: room,
            timestamp: Date.now(),
            message: `${user.username}: ${values.message}`,
          }),
        });

        formik2.resetForm();
      }
    },
  });

  useEffect(() => {
    const client = mqtt.connect("ws://localhost:8000/mqtt");

    client.on("connect", () => {
      setIsConnected(true);
    });

    if (isConnected && room !== "") {
      client.subscribe(room);
      setIsSubscribed(true);
    }

    if (isSubscribed) {
      client.on("message", (topic, message) => {
        setActualChat((prev) => [
          { id: id, message: message.toString() },
          ...prev,
        ]);
        setId(id + 1);
      });
    }

    setClient(client);

    return () => {
      client.end();
      setClient(null);
    };
  }, [room, isConnected, isSubscribed, id]);

  if (user === null) return <h1>Log in to use chat</h1>;
  return (
    <div className="flex flex-row">
      <div className="flex flex-col ml-10 h-full">
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-90">
          MQTT CHAT
        </h1>
        <div className="mt-[10px]">
          <form onSubmit={formik1.handleSubmit} className="flex flex-col">
            <input
              className="text-center mt-2 border-2 border-gray-600 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
              id="room"
              name="room"
              type="text"
              placeholder="Room"
              onChange={formik1.handleChange}
              onBlur={formik1.handleBlur}
              value={formik1.values.room}
            />
            <button
              type="submit"
              className="mt-[10px] group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Join
            </button>
          </form>
        </div>

        <div>
          {isSubscribed && (
            <div className="flex flex-col">
              <p className="text-xl mt-5 text-center mb-3">
                Aktualny room: {room} &nbsp;
              </p>
              <Link to={`/chathistory/${room}`}>
                <button className="mt-[10px] group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Chat history
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex-none">
        {isSubscribed && (
          <div className="w-[220%] h-[470px] border border-black ml-20 mt-6 rounded-xl bg-gray-800">
            <ul
              className="ml-5 h-[390px] overflow-y-auto overflow-hidden flex-col-reverse bg-gray-300 rounded-xl mt-5 p-5 pt-3 mr-5"
              id="chat"
            >
              {actualChat.map((message) => {
                return (
                  <div
                    key={message.id}
                    className="flex flex-row bg-gray-400 border p-2 b-2 rounded-xl mb-2"
                  >
                    <li key={message.id} className="mr-5 h-[30px] w-[90%]">
                      {message.message}
                    </li>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white rounded w-[10%]"
                      onClick={() =>
                        setActualChat(
                          actualChat.filter((item) => item.id !== message.id)
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </ul>
            <form onSubmit={formik2.handleSubmit} className="w-full">
              <input
                className="ml-5 mt-[10px] w-[80%] text-center border-2 border-gray-600 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
                id="message"
                name="message"
                type="text"
                placeholder="Message"
                onChange={formik2.handleChange}
                value={formik2.values.message}
              />
              <button
                className="ml-5 mt-[10px] w-[13%] group justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
