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
    <div className="flex flex-col items-center">
      <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-90">
        Chat History for "Room {id}"
      </h1>
      <div className="w-[80%]">
        <ul
          className="ml-5 h-[600px] overflow-y-auto overflow-hidden flex-col-reverse bg-gray-800 rounded-xl mt-3 p-5 pb-2 pt-3 mr-5"
          id="chat"
        >
          <div className="flex flex-col bg-gray-400 border border-2 border-indigo-700 p-2 b-2 rounded-xl w-full">
            {data.map((item) => (
              <div className="flex flex-row justify-between p-1 mb-2 border border-black rounded-xl">
                <li key={item._id} className="mr-5 flex flex-row w-full">
                  <p className="mt-1 w-[95%]">
                    {formatTime(item.timestamp)} - {item.message}
                  </p>
                  {logged && logged.type === "admin" && (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white rounded h-8 w-[10%]"
                      onClick={() => removeMessage(item._id)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              </div>
            ))}
          </div>
        </ul>
      </div>
      <div className="flex flex-col items-center">
        <Link
          to="/mqtt"
          className="mt-[10px] group relative flex w-[200px] justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <button>Back</button>
        </Link>
      </div>
    </div>
  );
}
