import React, { useEffect } from "react";
import mqtt from "precompiled-mqtt";
import { useParams } from "react-router-dom";
import { loggedContext } from "../App";
import { useContext } from "react";
import gra_panel from "../assets/gra_panel.png";
import swal from "sweetalert";

export default function Game() {
  const user = useContext(loggedContext);
  const { id } = useParams();
  const [room] = React.useState(id);
  const [client, setClient] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  //eslint-disable-next-line
  const [gameInfo, setActualGameInfo] = React.useState([]);
  const [joined, setJoined] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [tooLate, setTooLate] = React.useState(false);
  const [playerNumber, setPlayerNumber] = React.useState(null);
  const [startMsg, setStartMsg] = React.useState("Waiting for other player");
  const [yourTurn, setYourTurn] = React.useState(false);
  const [turnMsg, setTurnMsg] = React.useState("Poczekaj na swoją kolej");
  const [result, setResult] = React.useState(false);
  useEffect(() => {
    const client = mqtt.connect("ws://localhost:8000/mqtt");

    client.on("connect", () => {
      setIsConnected(true);
    });

    if (isConnected && room !== "") {
      client.subscribe(`game/${room}`);
      setIsSubscribed(true);
      if (!joined) {
        client.publish(
          `game/${room}`,
          JSON.stringify({
            user_id: user._id,
            user: user.username,
            message: "Joined",
          })
        );
        setJoined(true);
      }
    }

    if (isSubscribed) {
      client.on("message", (topic, message) => {
        const gameInfo = JSON.parse(message);
        setActualGameInfo((prev) => [...prev, gameInfo]);
        if (gameInfo.message === "Both players joined, game starts") {
          setStarted(true);
          setStartMsg("Both players joined, game starts soon");
          setTimeout(() => {
            setStartMsg(null);
          }, 2000);
        }
        if (gameInfo.message === "Game in this room already started") {
          setTooLate(true);
        }
        if (gameInfo.message === "number") {
          if (playerNumber === null) {
            setPlayerNumber(gameInfo.player);
          }
        }
        if (gameInfo.message === "first throw") {
          if (gameInfo.player === playerNumber) {
            setTurnMsg("You can roll the dice first");
            setYourTurn(true);
          }
        }
        if (gameInfo.message === "Dice throw") {
          if (gameInfo.player === playerNumber) {
            setTurnMsg("You rolled the dice, now it's time for second player");
            setYourTurn(false);
          } else {
            setTurnMsg("Second player rolled the dice, now it's your turn");
            setYourTurn(true);
          }
        }
        if (
          gameInfo.message === "Dice throw result" &&
          gameInfo.player === playerNumber
        ) {
          swal({
            title: "Dice throw result",
            text: `You rolled ${gameInfo.result}`,
            icon: "success",
            button: "OK",
          });
          setResult(true);
        }
        if (
          gameInfo.message === "Dice throw result" &&
          gameInfo.player !== playerNumber
        ) {
          setResult(false);
        }
      });
    }
    setClient(client);

    return () => {
      client.end();
      setClient(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, isConnected, isSubscribed, id, playerNumber, yourTurn]);

  return (
    <div>
      <h1 className="mt-5 text-center text-3xl font-bold tracking-tight text-gray-900 -mt-[15px]">
        Game
      </h1>
      <div className="flex flex-col ml-10 rounded-xl p-3 mt-10">
        <div className="bg-gray-400 w-[200px] p-5 pt-0 rounded-xl">
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-90 -mt-[15px]">
            Room: {room}
          </h2>
          <h3 className="mt-5 text-xl font-bold tracking-tight text-gray-90 -mt-[15px]">
            Player number {playerNumber}{" "}
          </h3>
        </div>
        {!started && !tooLate && (
          <h2 className="text-center text-3xl mt-[100px] mr-5">
            Waiting for other player...
          </h2>
        )}
        <h2>
          {started && (
            <p className="text-center text-3xl mt-[0px] mr-5">{startMsg}</p>
          )}
        </h2>
        <h2>
          {tooLate && !started && (
            <p className="text-center text-3xl mt-[0px] mr-5">
              Game in this room already started
            </p>
          )}
        </h2>
      </div>

      {started && startMsg === null && (
        <div className="flex flex-col items-center -mt-[80px]">
          <img src={gra_panel} alt="gra_panel" width="500px" />
          <br />
          <button
            className="bg-indigo-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={!yourTurn}
            onClick={() =>
              client.publish(
                `game/${room}`,
                JSON.stringify({
                  message: "Dice throw",
                  player: playerNumber,
                })
              )
            }
          >
            Rzuć kostką
          </button>
          &nbsp; <p className="-mt-3">{turnMsg}</p>
        </div>
      )}
    </div>
  );
}
