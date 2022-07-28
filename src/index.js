const express = require("express");
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
const { PORT } = require('./config');
const { databaseConnection } = require('./database/index');

// const { employee } = require('./api');
const expressApp = require("./express-app");

const StartServer = async() => {
    
    const app = express();
    
    await databaseConnection();
    
    await expressApp(app);
    //Handling uncaught Error
    process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught Exception promise rejection`);
    process.exit(1);

})

	app
		.listen(PORT || 8001, () => {
			console.log(`App is running on port ${PORT}`);
		})
		.on("error", (err) => {
			console.log(err);
			process.exit();
		});
};

StartServer();

