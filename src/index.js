const express = require('express');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
const cors = require('cors');
const { PORT } = require('./config');
const { databaseConnection } = require('./database/index');
// const { employee } = require('./api');
const expressApp = require('./express-app');


const StartServer = async() => {
    
    const app = express();
    // app.use(cors());
    await databaseConnection();
    
    await expressApp(app);

    app.listen(PORT || 8001,()=>{
        console.log("Connected to backend");
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

StartServer();





