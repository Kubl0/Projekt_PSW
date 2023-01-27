const express = require("express");
const routes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const mqtt = require("mqtt");
const GameManager = require("../game");

routes.route("/").get(function (req, res) {
  res.json({ message: "Hello World" });
});

routes.route("/adduser").post(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myobj = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    image: req.body.image,
    gamesWon: 0,
    gamesPlayed: 0,
    type: "user",
    profileDesc: "Nothing here yet...",
    image:
      "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png",
    type: "user",
  };
  db_connect.collection("users").insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
  res.json({ message: "User added successfully" });
});

routes.route("/getusers").get(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  db_connect
    .collection("users")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

routes.route("/getuser/:id").get(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("users").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

routes.route("/getusers/:search").get(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { username: { $regex: req.params.search, $options: "i" } };
  db_connect
    .collection("users")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

routes.route("/login").post(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myobj = {
    username: req.body.username,
    password: req.body.password,
  };
  db_connect.collection("users").findOne(myobj, function (err, result) {
    if (err) throw err;
    if (result) {
      res.json({ message: "Login successful", user: result });
    } else {
      res.json({ message: "Login failed" });
    }
  });
});

routes.route("/updateuser/:id").post(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      username: req.body.username,
      password: req.body.password,
      profileDesc: req.body.profileDesc,
      email: req.body.email,
      image: req.body.image,
    },
  };
  db_connect
    .collection("users")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
  res.json({ message: "User updated" });
});

routes.route("/deleteuser/:id").delete(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("users").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
  res.json({ message: "User deleted" });
});

routes.route("/addchatmessage").post(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myobj = {
    user: req.body.user,
    message: req.body.message,
    timestamp: req.body.timestamp,
    room: req.body.room,
  };
  db_connect.collection("chatmessages").insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
  res.json({ message: "Chat message added successfully" });
});

routes.route("/getchathistory/:room").get(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { room: req.params.room };
  db_connect
    .collection("chatmessages")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

routes.route(`/deletechathistory/:message_id`).delete(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { _id: ObjectId(req.params.message_id) };

  db_connect.collection("chatmessages").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
});

routes.route("/addgameroom").post(function (req, res) {
  const gManager = new GameManager();
  gManager.startGame(req.body.room);
});

module.exports = routes;
