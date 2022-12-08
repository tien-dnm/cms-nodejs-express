require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/db");
require("express-async-errors");
const v1Router = require("./src/api/v1/routes");

db.connect();

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger("dev"));

app.use(cors());

app.use("/api/v1", v1Router);

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.use((err, req, res) => {
  console.log(err.stack);
  res.status(err.status || 500).send(err.message);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
