import express from "express";

import logging from "./startup/logging";
import startup from "./startup/routes";
import getAppConfig from "./utilities/appConfig";

const app = express();

const port = getAppConfig().app_port;

const main = async () => {
  try {
    logging();
    startup(app);
    app.listen(port, () => {
      console.log(`
😉 Backend now running on port: ${port} 
      `);
    });
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to db");
  }
};

main();
