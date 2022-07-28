// const { Error_Hander } = require('../../utils/newErrorhandler');
// const {ErrorHander} = require('../../utils/error-handler');
const {Errors} = require('../../utils/app-errors');
const jwt = require('jsonwebtoken');
const {EmployeeModel} = require("../../database/models");





// exports.isAuthenticatedUser =  async(req,res,next)=>{
//     //just getting token value without json object
//     const {token} = req.cookies;
    
//     if(!token){
//         return next(new Errors("Please login to access this resource",401));
//     }

//     //if have  token then 
//     const decodedData = jwt.verify(token, process.env.APP_SECRET);
   

//     //id is that which we created when creating jwt token
//    req.user =  await EmployeeModel.findById(decodedData._id);
//     // console.log(req.user);
//     next();

// };
exports.isAuthenticatedUser =  async(req,res,next)=>{
    //just getting token value without json object
    const {token} = req.cookies;
    
    if(!token){
        return next(new Errors("Please login to access this resource",401));
    }

    //if have  token then 
    const decodedData = jwt.verify(token, process.env.APP_SECRET);
   

    //id is that which we created when creating jwt token
   req.user =  await EmployeeModel.findById(decodedData._id);
    // console.log(req.user);
    next();

};


exports.authorizeRoles = (...roles)=>{
    
    return (req,res,next)=>{
        // console.log(req.user.role);
        if(!roles.includes(req.user.role)){
           return next(new Errors("You are not admin",403));
        }
        next();
    };
};