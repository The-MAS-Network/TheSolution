# The Solution Web Application - Phase 3 Documentation by Ubong Jacob

## Overview

This is a monolithic web application that uses React for the frontend and is Node.js for the backend. Note: This is documentation for the solution web application challenge as outlined on the third phase of this competition and it is subject to change as new tools may or may not be introduced.

## Major Tools Used

- React JS - Frontend
- Node.js - Backend
- MySQL - Database
- Visual Studio Code ( VsCode ) - IDE
- Yarn - Package manager
- [hiro.so](http://hiro.so/) - For inscriptions look up
- [btcpayserver.org](https://btcpayserver.org) - For handling payments.
- [voltage.cloud](https://voltage.cloud) - Bitcoin Node server.

## Requirements

1. Node.js
2. XAMPP
3. Git and basic knowledge of git
4. VsCode or any IDE
5. Hiro.so API Key which can be gotten from here [https://platform.hiro.so/settings/api-keys](https://platform.hiro.so/settings/api-keys)
6. Basic knowlege of Bitcoin Node setup. A guide can be found here **[Voltage's comprehensive video playlist](https://www.youtube.com/playlist?list=PLuMtKGSqizH1vMPiWvxgwIM8KRx1V9-Di)**
7. BTCpayserver account which can be gotten from here [btcpayserver.org](https://btcpayserver.org)

## Section A: General Steps

1. Download Node.js LTS (minimum of Node.js version 20.9.0) from [Node.js website](https://nodejs.org/en).
2. Run the installation wizard and install Node.js.
3. Clone the repository from [GitHub](https://github.com/UbongJacob/TheSolution.git).
4. Open the project in your IDE ( VsCode ).
5. Open your terminal in your IDE ( VsCode ).
6. Install yarn using the command `npm install --global yarn`
7. Install all project dependencies ( both backend and frontend ) using a single command `yarn install`

## Section B: Backend Steps

This section focuses mainly on how to get the backend running with Node.js and MySQL.

1. Download XAMPP from [here](https://www.apachefriends.org).
2. Follow this guide to download and install XAMPP [here](https://www.temok.com/blog/xampp-installation-on-windows).
3. Start up MySQL and Apache servers.
4. On your web browser, enter the URL `http://localhost/phpmyadmin/`.
5. Create a database with any name of your choice. For this guide, we will name it `the-solution-app-db`.
6. Navigate to the `backend` folder using your IDE ( VsCode ).
7. Create a `.env` file in the root folder of the backend and paste the following variables:

   APP_JWT_PRIVATE_KEY=QB4qF4msjvT8fjkasdfjaFjgAoralnnvoB

   DB_USERNAME=root

   DB_PASSWORD=

   DB_HOST=localhost

   DB_DBNAME=the-solution-app-db

   DB_PORT=3306

   HIRO_SO_API_KEY=00x

   ### Configuration Settings:

   This guide walks you through configuring your application's settings file. Let's explore each key element and how to customize it for your environment.

   #### Database Connection:

   DB_USERNAME: This is the username you use to access your database. By default, XAMPP uses "root" for administrative access.

   DB_PASSWORD: Enter your database password if you've set one. If not, leave it blank (the default).

   DB_HOST: This specifies the location of your database server. Since we're running it locally, use "localhost".

   DB_DBNAME: Enter the name you assigned to your database during creation (e.g., "the-solution-app-db").

   DB_PORT: This defines the port your MySQL database uses for communication. The default is 3306.
   Application Settings:

   #### External Services:

   HIRO_SO_API_KEY: We use the Hiro.so platform to access Ordinal and Inscription data. Obtain your API key from [https://platform.hiro.so/settings/api-keys](https://platform.hiro.so/settings/api-keys)

   BTC_PAY_SERVER: **[btcpayserver](https://btcpayserver.org)**

   VOLTAGE_NODE: **[Voltage lightning node](https://voltage.cloud)**

   ### Steps:

   1. Create accounts on both platforms.
   2. Open a channel on Voltage with a minimum of 500,000 sats.
   3. Follow **[Voltage's comprehensive video playlist](https://www.youtube.com/playlist?list=PLuMtKGSqizH1vMPiWvxgwIM8KRx1V9-Di)** for detailed instructions.
   4. Link your btcpay server to your Voltage node by providing the required credentials from Voltage to btcpay server.

   #### Remember:

   Replace the placeholders with your specific values.
   Double-check your entries to ensure smooth operation.

8. Run `yarn migrate` to generate migration files. NOTE: Make sure your XAMP or MySQL is running before you run this command.

9. You should see some new tables on your phpMyAdmin tab in your browser once you refresh.

10. Go back to your VsCode terminal and run `yarn dev`.
11. After a minute or less, you will see messages on the console:"Now running on port 8080 or any given custom port".
    At this point we have been able to connect our backend to the data base.. If you are a backend developer and want to explore more you can check out the documentation [here](https://documenter.getpostman.com/view/19556853/2sA2r6Win5)

## Section C: Frontend Steps

This section focuses mainly on how to get the frontend running with React and the backend we have set up.

1.  Navigate to the `frontend` folder in your IDE (VsCode).
2.  Create a `.env` file in the root folder of the frontend and paste the following variables:

    VITE_CRYPTO_JS_ENCRYPTION_KEY=K6BWKW7FFKi5mBK1fxK954hB

    VITE_APP_BACKEND_BASE_URL=http://localhost:8080

    ### DESCRIPTION:

    VITE_CRYPTO_JS_ENCRYPTION_KEY is a value used for encryption of some details on the frontend you can change them to your own keys of choice

    VITE_APP_BACKEND_BASE_URL: This is a url to the backend you can use http://localhost:8080 but make sure that your backend is running on that port or alternatively you can use the live url in which I am using for the submission of this challenge https://the-solution-backend.ubongjacob.com/api (NOTE: THIS MIGHT CHANGE OVER TIME.)

3.  Run the command `yarn dev` and your website should be live on http://localhost:5173 or look at your vscode terminal to find the development server link.

## Secton D: Production Deployment for Monolithic Architecture

This section outlines the deployment process for our monolithic application in a production environment.

Key Points:

Independent Platform Deployment: Despite being monolithic, it is best to run independent deployments for each platform (frontend and backend) during production.

### Deployment Steps:

1. Extract Folders: Extract the relevant folders for the frontend and backend components on your production server.

2. Build for Distribution:

For the frontend: Navigate to the extracted frontend directory and run the command yarn build. This will generate an optimized production-ready folder named dist.

For the backend: Navigate to the extracted barckend directory and run the command yarn build.

Production Deployment:

Copy the generated dist folder (from the frontend) and the built backend application files to their designated locations on your production server.
Start the Application:

Follow the instructions provided in package.json for your backend framework to start the backend server process.
Your production environment should now be operational!

## Section E: Summary

In case of any questions about any of the steps, you can always drop comments on the competition channel [here](https://discord.com/channels/1164829493781876806/1193633156599918612) or join the Discord server [here](https://discord.gg/XC9aCT3q).
