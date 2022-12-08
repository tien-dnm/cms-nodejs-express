require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

require("express-async-errors");
const v1Router = require("./src/api/v1/routes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

mongoose.connect(process.env.MONGO_DB_URL);
const { connection } = mongoose;
connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", async () => {
  console.log("Database connected");
});

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
