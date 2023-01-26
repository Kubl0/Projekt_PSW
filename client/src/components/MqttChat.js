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
          ...prev,
          { id: id, message: message.toString() },
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
    <div>
      <h1>MQTT CHAT</h1>
      <div>
        <form onSubmit={formik1.handleSubmit}>
          <input
            id="room"
            name="room"
            type="text"
            placeholder="Room"
            onChange={formik1.handleChange}
            onBlur={formik1.handleBlur}
            value={formik1.values.room}
          />
          <button type="submit">Join</button>
        </form>
      </div>

      {isSubscribed && (
        <>
          <p>Aktualny room: {room} &nbsp;</p>
          <button>
            <Link to={`/chathistory/${room}`}>Chat history</Link>
          </button>
          <br />
          <br />
          <form onSubmit={formik2.handleSubmit}>
            <input
              id="message"
              name="message"
              type="text"
              placeholder="Message"
              onChange={formik2.handleChange}
              value={formik2.values.message}
            />
            <button type="submit">Send</button>
          </form>
          <div>
            <div id="chat">
              <ul>
                {actualChat.map((message) => {
                  return (
                    <div key={message.id}>
                      <li key={message.id}>{message.message}</li>
                      <button
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}
