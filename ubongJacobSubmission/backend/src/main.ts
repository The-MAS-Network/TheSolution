import "dotenv/config";
import express from "express";
import "reflect-metadata";

import logging from "./startup/logging";
import startup from "./startup/routes";
import dataSource from "./db/data-source";

const app = express();

const main = async () => {
  try {
    await dataSource.initialize();
    console.log("Connected to Mysql");
    logging();
    startup(app);
    app.listen(8080, () => {
      console.log("Now running on port 8080");
    });
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to db");
  }
};

main();
