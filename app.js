import dotenv from "dotenv";
import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import db from "./config/db.js";
import swaggerOptions from "./config/swagger.js";
import v1Router from "./src/api/v1/routes.js";

dotenv.config();

db.connect();

const specs = swaggerJsdoc(swaggerOptions);
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger("dev"));

app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/v1", v1Router);

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
