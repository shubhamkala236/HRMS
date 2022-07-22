const express = require('express');
const cors  = require('cors');
const cookieParser = require("cookie-parser");
const  fileUpload = require('express-fileupload');
const path = require('path');
const ejs = require("ejs");


const { employee, appEvents  } = require('./api');
const HandleErrors = require('./utils/error-handler')


module.exports = async (app) => {
    app.use(cors({
        origin: '*' ,
        credentials: true
      }));
    app.use(express.json());
    app.use(cookieParser())
    
    app.use(fileUpload({
        useTempFiles : true
    }));

    // const staticPath = path.join(__dirname,"/views")
    app.use(express.static(path.join(__dirname,"/views")));
    app.set('views',__dirname+'/views');
    app.set('view engine', 'ejs');
    

    app.use(express.urlencoded({ extended: true }));

    //Listeners
    // appEvents(app);

    //api
    employee(app);

    // error handling
    app.use(HandleErrors);
    
}