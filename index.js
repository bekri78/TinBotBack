require("dotenv").config();
const express = require("express");
const connection = require("./db");
const cors = require("cors");
const serverPort = process.env.PORT || 4000;
const app = express();

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  } else {
    console.log(
      "connected to database with threadId :  " + connection.threadId
    );
  }
});

app.use(cors("http://localhost:4000"));
app.use(express.json());

app.get("/profile", (req, res) => {
  connection
    .promise()
    .query("SELECT * FROM profile")
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving profile from db.");
    });
});

app.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort}`);
});
