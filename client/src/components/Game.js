import React, { useEffect, useRef } from "react";
import mqtt from "precompiled-mqtt";
import { useParams } from "react-router-dom";
import { loggedContext } from "../App";
import { useContext } from "react";
import gra_panel from "../assets/gra_panel.png";
import swal from "sweetalert";
import pawn1 from "../assets/pawn1.png";
import pawn2 from "../assets/pawn2.png";

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
  const [turnMsg, setTurnMsg] = React.useState("Wait for your turn");
  const [result, setResult] = React.useState(false);

  let table = Array(100);

  for (let i = 0; i < 100; i++) {
    if (i < 10) table[i] = 100 - i;
    else if (i < 20) table[i] = 80 + i - 9;
    else if (i < 30) table[i] = 100 - i;
    else if (i < 40) table[i] = 60 + i - 29;
    else if (i < 50) table[i] = 100 - i;
    else if (i < 60) table[i] = 40 + i - 49;
    else if (i < 70) table[i] = 100 - i;
    else if (i < 80) table[i] = 20 + i - 69;
    else if (i < 90) table[i] = 100 - i;
    else if (i < 100) table[i] = i - 89;
  }

  const [position1, setPosition1] = React.useState(1);
  const [position2, setPosition2] = React.useState(1);

  console.log(table);
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
          if (playerNumber === 1) setPosition1(gameInfo.position);
          else setPosition2(gameInfo.position);
        }
        if (
          gameInfo.message === "Dice throw result" &&
          gameInfo.player !== playerNumber
        ) {
          if (playerNumber === 1) setPosition2(gameInfo.position);
          else setPosition1(gameInfo.position);
        }
        if (gameInfo.message === "Win") {
          if (gameInfo.player === playerNumber) {
            swal({
              title: "You won!",
              text: "Congratulations!",
              icon: "success",
              button: "OK",
            });
            setResult(true);
          } else {
            swal({
              title: "You lost!",
              text: "Better luck next time!",
              icon: "error",
              button: "OK",
            });
            setResult(true);
          }
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

  console.log(position1, position2);

  return (
    <div>
      <h1 className="mt-[20px] text-center text-3xl font-bold tracking-tight text-gray-900">
        Game
      </h1>
      <div className="flex flex-col ml-10 rounded-xl p-3 mt-10">
        <div className="bg-gray-400 w-[12%] p-5 rounded-xl">
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-90 -mt-[15px]">
            Room: {room}
          </h2>
          <h3 className="mt-[10px] text-xl font-bold tracking-tight text-gray-90 -mt-[15px]">
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
        <div className="flex flex-col items-center -mt-[130px]">
          <div>
            <table className="grid justify-center bg-plansza">
              <tr className="grid grid-cols-10 w-[500px]">
                {table.map((item, index) => {
                  return (
                    <td className="border-black border w-full h-[50px]">
                      <p className="flex flex-row">
                        {position1 === item && position2 !== item && (
                          <img
                            src={pawn1}
                            alt="pawn1"
                            width="40px"
                            className="relative top-1 left-1"
                          ></img>
                        )}
                        {position1 === item && position2 === item && (
                          <img
                            src={pawn1}
                            alt="pawn1"
                            width="40px"
                            className="relative top-1"
                          ></img>
                        )}
                        {position2 === item && position1 === item && (
                          <img
                            src={pawn2}
                            alt="pawn2"
                            width="40px"
                            className="relative -left-8"
                          ></img>
                        )}
                        {position2 === item && position1 !== item && (
                          <img
                            src={pawn2}
                            alt="pawn2"
                            width="40px"
                            className="relative top-1"
                          ></img>
                        )}
                      </p>
                    </td>
                  );
                })}
              </tr>
            </table>
          </div>
          <button
            className="mt-10 bg-indigo-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
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
