import React, { useEffect } from "react";
import mqtt from "precompiled-mqtt";
import { useParams } from "react-router-dom";
import { loggedContext } from "../App";
import { useContext } from "react";
import gra_panel from "../assets/gra_panel.png";

export default function Game() {
  const user = useContext(loggedContext);
  const { id } = useParams();
  const [room, setRoom] = React.useState(id);
  const [client, setClient] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [gameInfo, setActualGameInfo] = React.useState([]);
  const [joined, setJoined] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [tooLate, setTooLate] = React.useState(false);
  const [playerNumber, setPlayerNumber] = React.useState(null);
  const [startMsg, setStartMsg] = React.useState("Waiting for other player");
  const [yourTurn, setYourTurn] = React.useState(false);
  const [turnMsg, setTurnMsg] = React.useState("");

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
            setTurnMsg("Jesteś pierwszy, możesz rzucić kostką");
            setYourTurn(true);
          }
        }
      });
    }
    setClient(client);

    return () => {
      client.end();
      setClient(null);
    };
  }, [room, isConnected, isSubscribed, id, playerNumber, yourTurn]);

  return (
    <div>
      <h1>Game</h1>
      <h2>Room: {room}</h2>
      <h2>Player number {playerNumber} </h2>
      {!started && !tooLate && <h2>Waiting for other player</h2>}
      <h2>{started && <p>{startMsg}</p>}</h2>
      <h2>{tooLate && !started && <p>Game in this room already started</p>}</h2>

      {started && startMsg === null && (
        <div>
          <img src={gra_panel} alt="gra_panel" width="500px" />
          <br />
          <button
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
          &nbsp; {turnMsg}
        </div>
      )}
    </div>
  );
}
