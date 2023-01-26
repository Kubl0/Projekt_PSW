const e = require("express");
const mqtt = require("mqtt");
let rooms = [];

class GameManager {
  constructor() {
    this.client = mqtt.connect("ws://localhost:8000/mqtt");
  }

  startGame(room) {
    if (rooms.find((r) => r === room)) return;
    else {
      rooms.push(room);
      this.client.on("connect", () => {
        console.log("Connected to MQTT");
        this.client.subscribe(`game/${room}`);
        this.client.publish(
          `game/${room}`,
          JSON.stringify({ message: "Game server started" })
        );
      });
    }
    this.gameJoin(room);
  }

  gameJoin(room) {
    let players = [];
    console.log("Game started in room: " + room);
    this.client.on("message", (topic, message) => {
      const gameInfo = JSON.parse(message);
      console.log(gameInfo.message);
      if (gameInfo.message === "Joined" && players.length < 2) {
        players.push(gameInfo.user);
        console.log("Players: ", players);
        setTimeout(() => {
          this.client.publish(
            `game/${room}`,
            JSON.stringify({ message: "number", player: players.length })
          );
        }, 500);

        if (players.length === 2) {
          setTimeout(() => {
            this.client.publish(
              `game/${room}`,
              JSON.stringify({ message: "Both players joined, game starts" })
            );
          }, 1000);
          this.gameLogic(room);
        }
      }
      if (gameInfo.message === "Joined" && players.length == 2) {
        setTimeout(() => {
          this.client.publish(
            `game/${room}`,
            JSON.stringify({ message: "Game in this room already started" })
          );
        }, 1000);
      }
    });
  }

  gameLogic(room) {
    setTimeout(() => {
      this.client.publish(
        `game/${room}`,
        JSON.stringify({
          message: "first throw",
          player: Math.floor(Math.random() * 2) + 1,
        })
      );
    }, 1000);
  }
}

module.exports = GameManager;
