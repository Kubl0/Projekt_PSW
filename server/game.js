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
    let playerPosition = [0, 0];
    setTimeout(() => {
      this.client.publish(
        `game/${room}`,
        JSON.stringify({
          message: "first throw",
          player: Math.floor(Math.random() * 2) + 1,
        })
      );
    }, 1000);

    this.client.on("message", (topic, message) => {
      const gameInfo = JSON.parse(message);
      if (gameInfo.message === "Dice throw") {
        let result = parseInt(Math.floor(Math.random() * 6) + 1);
        if (playerPosition[gameInfo.player - 1] + result < 100) {
          playerPosition[gameInfo.player - 1] += result;
          //drabiny
          if (playerPosition[gameInfo.player - 1] === 4)
            playerPosition[gameInfo.player - 1] = 25;
          if (playerPosition[gameInfo.player - 1] === 21)
            playerPosition[gameInfo.player - 1] = 39;
          if (playerPosition[gameInfo.player - 1] === 29)
            playerPosition[gameInfo.player - 1] = 74;
          if (playerPosition[gameInfo.player - 1] === 43)
            playerPosition[gameInfo.player - 1] = 76;
          if (playerPosition[gameInfo.player - 1] === 78)
            playerPosition[gameInfo.player - 1] = 81;
          if (playerPosition[gameInfo.player - 1] === 90)
            playerPosition[gameInfo.player - 1] = 92;

          //weze
          if (playerPosition[gameInfo.player - 1] === 30)
            playerPosition[gameInfo.player - 1] = 7;
          if (playerPosition[gameInfo.player - 1] === 47)
            playerPosition[gameInfo.player - 1] = 15;
          if (playerPosition[gameInfo.player - 1] === 56)
            playerPosition[gameInfo.player - 1] = 19;
          if (playerPosition[gameInfo.player - 1] === 73)
            playerPosition[gameInfo.player - 1] = 51;
          if (playerPosition[gameInfo.player - 1] === 82)
            playerPosition[gameInfo.player - 1] = 59;
          if (playerPosition[gameInfo.player - 1] === 98)
            playerPosition[gameInfo.player - 1] = 55;

          console.log(playerPosition);
          setTimeout(() => {
            this.client.publish(
              `game/${room}`,
              JSON.stringify({
                message: "Dice throw result",
                player: gameInfo.player,
                result: result,
                position: playerPosition[gameInfo.player - 1],
              })
            );
          }, 500);
        }

        if (playerPosition[gameInfo.player - 1] + result === 100) {
          this.client.publish(
            `game/${room}`,
            JSON.stringify({
              message: "Win",
              player: gameInfo.player,
            })
          );
        }
      }
    });
  }
}

module.exports = GameManager;
