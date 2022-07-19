const express = require('express');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const { PORT } = require('./config');
const { databaseConnection } = require('./database/index');
// const { employee } = require('./api');
const expressApp = require('./express-app');


const StartServer = async() => {

    const app = express();
    
    await databaseConnection();
    
    await expressApp(app);

    app.listen(8000,()=>{
        console.log("Connected to backend");
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

StartServer();



// const app = express();
// dotenv.config();

// const connect = async()=>{
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log("Connected to database");
//     } catch (error) {
//         throw error;
//     }
// };

// // if disconnection occurs 
// mongoose.connection.on("disconnected", ()=>{
//     console.log("mongodb disconnected");
// });

// //middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// //Event Listener
// app.use('/app-events', async (req,res,next) => {

//     const { payload } = req.body;

//     console.log("===============  Employee Service Received Event ====== ");
//     return res.status(200).json(payload);

// });

// // app.use('/employee',employeeRoute);
// employee()
// //error handling
// app.use((err,req,res,next)=>{
//     const errorStatus = err.status || 500;
//     const errorMessage= err.message || "Something went wrong";

//     return res.status(errorStatus).json({
//         success: false,
//         status: errorStatus,
//         message: errorMessage,
//         stack: err.stack,
//     });
// })

// app.listen(8000,()=>{
//     connect()
//     console.log("Connected to backend");
// });

