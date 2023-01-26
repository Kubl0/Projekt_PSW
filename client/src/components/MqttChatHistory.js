import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { loggedContext } from "../App";
import { useContext } from "react";

export default function MqttChatHistory() {
  const logged = useContext(loggedContext);

  const { id } = useParams();

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/getchathistory/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, [id, data]);

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString();
    const dateStr = date.toLocaleDateString();
    return `${dateStr} ${time}`;
  }

  function removeMessage(message_id) {
    fetch(`http://localhost:5000/deletechathistory/${message_id}`, {
      method: "DELETE",
    }).then((res) => {});
  }

  return (
    <div>
      <h1>Chat History</h1>
      <p>Chat History for {id}</p>
      <ul>
        {data.map((item) => (
          <li key={item._id}>
            <p>
              {formatTime(item.timestamp)} - {item.message}
              {logged && logged.type === "admin" && (
                <button onClick={() => removeMessage(item._id)}>Delete</button>
              )}
            </p>
          </li>
        ))}
      </ul>
      <button>
        <Link to="/mqtt">Back</Link>
      </button>
    </div>
  );
}
