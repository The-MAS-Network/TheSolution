# The Solution Tasks by Ubong Jacob Documentation

## Overview

This is not a monolithic web application as the frontend (React) is separated from the backend (Node.js). Note: This is documentation for the first phase of this competition and it is subject to change as new tools may or may not be introduced.

## Major Tools Used

- React JS - Frontend
- Node.js - Backend
- MySQL - Database
- VsCode - IDE

## Requirements

1. Node.js
2. XAMPP
3. Git and basic knowledge of git
4. VsCode or any IDE

## Section A: General Steps

1. Download Node.js LTS (minimum of Node.js version 20.9.0) from [Node.js website](https://nodejs.org/en).
2. Run the installation wizard and install Node.js.
3. Clone the repository from [GitHub](https://github.com/UbongJacob/TheSolution.git).
4. Open the project in VsCode by using the command `cd TheSolution && code .`.
5. Open your terminal in VsCode.
6. Use Git to switch to `challenge1-submission/UbongJacob` branch using the command `git checkout challenge1-submission/UbongJacob`.
7. Navigate to the `ubongJacobSubmission` folder in the file explorer of VsCode. Inside it, there are 2 folders: `frontend` and `backend`.

## Section B: Backend Steps

This section focuses mainly on how to get the backend running with Node.js and MySQL.

1. Download XAMPP from [here](https://www.apachefriends.org).
2. Follow this guide to download and install XAMPP [here](https://www.temok.com/blog/xampp-installation-on-windows).
3. Start up MySQL and Apache servers.
4. On your web browser, enter the URL `http://localhost/phpmyadmin/`.
5. Create a database with any name of your choice. For this guide, we will name it `the-solution-db`.
6. Navigate to the `backend` folder in VsCode terminal using the command `cd ubongJacobSubmission\backend`.
7. Run the command `npm install` to install the dependencies.
8. Create a `.env` file in the root folder of the backend and paste the following variables:

   APP_JWT_PRIVATE_KEY=WdBwe4qF4msjvT8Mys937QqFjgAor05MSZrB

   APP_CRYPTO_JS_KEY=VHDOxrE14AOp3LcQrFX3hWGLl4o9JT1C

   DB_USERNAME=root

   DB_PASSWORD=

   DB_HOST=localhost

   DB_DBNAME=the-solution-db

   DB_PORT=3306

   ### DESCRIPTION:

   APP_JWT_PRIVATE_KEY and APP_CRYPTO_JS_KEY are values used for encryption of some details on the server you can change them to your own keys of choice

   DB_USERNAME: This is your database admin username by default when you install xampp it configures one named root for you.

   DB_PASSWORD: this is the admin password of the database by default it is undefined that is why we did not pass any value.

   DB_HOST: This is a URL where our database is located since we are using this locally on our machine we can use localhost.

   DB_DBNAME: this is the name that we used in creating out database in SECTION B step 5 we chose the-solution-db but if you used any other name do use that name here.

   DB_PORT: This is the port in which our MySQL database is running by default it runs on port 3306

9. Run `npm run migration:generate -– ./src/db/migrations/migrationName` to generate migration files.
10. Once migration files are created successfully, run `npm run migration:run`.
11. You should see a new table on your phpMyAdmin tab in your browser once you refresh.
12. Go back to your VsCode terminal and run `npm run dev`.
13. After a minute or less, you will see messages on the console: "Connected to MySQL" and "Now running on port 8080".
    At this point we have been able to connect our backend to the data base.. If you are a backend developer and want to explore more you can check out the documentation [here](https://documenter.getpostman.com/view/19556853/2sA2r6Win5)

## Section C: Frontend Steps

This section focuses mainly on how to get the frontend running with React and the backend we have set up.

1.  Navigate to the `frontend` folder in VsCode terminal using the command `cd ubongJacobSubmission\frontend`.
2.  Run the command `npm install` to install the dependencies.
3.  Create a `.env` file in the root folder of the frontend and paste the following variables:

    VITE_CRYPTO_JS_ENCRYPTION_KEY=K6BWKW7FFKi5mBK1fxK954hB

    VITE_APP_BACKEND_BASE_URL=http://localhost:8080

    ### DESCRIPTION:

    VITE_CRYPTO_JS_ENCRYPTION_KEY is a value used for encryption of some details on the frontend you can change them to your own keys of choice

    VITE_APP_BACKEND_BASE_URL: This is a url to the backend you can use http://localhost:8080 but make sure that your backend is running on that port or alternatively you can use the live url in which I am using for the submission of this challenge https://the-solution.ubongjacob.dev/api

4.  In case of any questions about any of the steps, you can always drop comments on the competition channel [here](https://discord.com/channels/1164829493781876806/1193633156599918612) or join the Discord server [here](https://discord.gg/XC9aCT3q).
