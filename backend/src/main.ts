import "dotenv/config";
import express from "express";
import "reflect-metadata";

import dataSource from "./db/data-source";
import logging from "./startup/logging";
import startup from "./startup/routes";
import getAppConfig from "./utilities/appConfig";
import sendExternalMessage from "./utilities/sendExternalMessage";

const app = express();

const port = getAppConfig().app_backend_port;

const main = async () => {
  try {
    await dataSource.initialize();
    console.log("Connected to Mysql");
    sendExternalMessage("Connected to the server");
    logging();
    startup(app);
    app.listen(port, () => {
      console.log(`Now running on port: ${port} `);
    });
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to db");
  }
};

main();
