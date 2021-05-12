require("dotenv").config();
const express = require("express");
const connection = require("./db");
const cors = require("cors");
const Joi = require('joi');
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

app.get('/profile', (req, res) => {
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

app.post('/profile', (req, res) => {
  const { type, relation, name, picture, biography } = req.body;
  const { error: validationErrors } = Joi.object({
    type: Joi.string().max(255).required(),
    relation: Joi.string().max(255).required(),
    name: Joi.string().max(255).required(),
    picture: Joi.string().max(255).required(),
    biography: Joi.string().max(255).required()
}).validate({ type, relation, name, picture, biography }, { abortEarly: false });

if (validationErrors) {
    res.status(422).json({ errors: validationErrors.details });
  } else {
    connection.promise()
    .query('INSERT INTO profile (type, relation, name, picture, biography) VALUES (?, ?, ?, ?, ?)', [type, relation, name, picture, biography])
    .then(([result]) => {
      const createProfile = { id: result.insertId, type, relation, name, picture, biography };
      res.json(createProfile);
    }).catch((err) => { console.error(err); res.sendStatus(500); });
  }
});
 
app.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort}`);
});
