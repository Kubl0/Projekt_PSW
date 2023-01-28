const express = require("express");
const routes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const mqtt = require("mqtt");
const GameManager = require("../game");
const fs = require("fs");

var util = require("util");

var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
var log_stdout = process.stdout;

console.log = function (d) {
  log_file.write(util.format(d) + "\n");
  log_stdout.write(util.format(d) + "\n");
};

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
    comments: [],
  };
  db_connect.collection("users").insertOne(myobj, function (err, res) {
    if (err) throw err;
    let now = new Date();
    console.log(now + " 1 user registered, user: " + myobj.username + "");
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
  let now = new Date();
  console.log(now + "User list sent to client");
});

routes.route("/getuser/:id").get(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("users").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
  let now = new Date();
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
  let now = new Date();
  console.log(now + "Filtered user list sent to client");
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

  let now = new Date();
  console.log(now + "User logged in, user: " + myobj.username + "");
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
      let now = new Date();
      console.log(now + "User updated, user: " + req.body.username + "");
    });
  res.json({ message: "User updated" });
});

routes.route("/deleteuser/:id").delete(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("users").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    let now = new Date();
    console.log(now + "User deleted, user: " + req.body.username + "");
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
    let now = new Date();
    console.log(now + " 1 chat message added, user: " + myobj.user + "");
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
  let now = new Date();
  console.log(now + "Chat history sent to client");
});

routes.route(`/deletechathistory/:message_id`).delete(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { _id: ObjectId(req.params.message_id) };

  db_connect.collection("chatmessages").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    let now = new Date();
    console.log(now + "Chat message deleted");
  });
});

routes.route("/addgameroom").post(function (req, res) {
  const gManager = new GameManager();
  gManager.startGame(req.body.room);
  let now = new Date();
  console.log(now + "Game room created, room: " + req.body.room + "");
});

routes.route("/addPlayedGame/:id").post(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $inc: {
      gamesPlayed: 1,
    },
  };
  db_connect
    .collection("users")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      let now = new Date();
      console.log(now + "1 game played added to user");
    });
});

routes.route("/addWonGame/:id").post(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $inc: {
      gamesWon: 1,
    },
  };
  db_connect
    .collection("users")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      let now = new Date();
      console.log(now + "1 game won added to user");
    });
});

routes.route("/addComment").post(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myobj = {
    user: req.body.user,
    name: req.body.name,
    comment: req.body.comment,
    timestamp: req.body.timestamp,
    userProfile: req.body.userProfile,
  };
  db_connect.collection("comments").insertOne(myobj, function (err, res) {
    if (err) throw err;
    let now = new Date();
    console.log(now + " 1 comment added, user: " + myobj.user + "");
  });
  res.json({ message: "Comment added successfully" });
});

routes.route("/getComments/:id").get(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { userProfile: req.params.id };
  db_connect
    .collection("comments")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  let now = new Date();
  console.log(now + "Comments sent to client");
});

routes.route("/deleteComment/:id").delete(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { _id: ObjectId(req.params.id) };

  db_connect.collection("comments").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    let now = new Date();
    console.log(now + "Comment deleted");
  });
});

routes.route("/editComment/:id").post(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      comment: req.body.comment,
    },
  };
  db_connect
    .collection("comments")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      let now = new Date();
      console.log(now + "Comment edited");
    });
});

module.exports = routes;
