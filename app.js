require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const cors = require("cors");
require("express-async-errors");
const v1Router = require("./src/api/v1/routes");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

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
