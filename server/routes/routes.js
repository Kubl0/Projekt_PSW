const express = require("express");
const routes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

routes.route("/").get(function (req, res) {
  res.json({ message: "Hello World" });
});

routes.route("/adduser").post(function (req, res) {
  let db_connect = dbo.getDb("mydb");
  let myobj = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
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

module.exports = routes;
