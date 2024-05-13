import "dotenv/config";
import express from "express";
import "reflect-metadata";

import dataSource from "./db/data-source";
import logging from "./startup/logging";
import startup from "./startup/routes";
// import { ordinalWalletsVerificationCronJob } from "./cron-jobs";

const app = express();

const port = 8080;

const main = async () => {
  try {
    await dataSource.initialize();
    console.log("Connected to Mysql");
    // ordinalWalletsVerificationCronJob.start();

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
