const validator = require("validator");

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxlength: [30, "Name cannot exceed 30 characters"],
        minlength: [4, "Name should have more than 5 characters"],
      },
      email: {
        type: String,
        required: [true, "Please enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"],
      },
    dateOfBirth: {
        type: Date,
        required: true,
        trim: true,
    },
    phoneNumber:{
        type: Number,
        required: true,
    },
    current_address: {
        type: String,
        required: true,
    },
    perma_address: {
        type: String,
        required: true,
    },
    dateOfJoining: {
        type: Date,
        default:Date.now,
    },
   adhaarNumber:{
        type: Number,
        required: true,
        maxlength: [12, "Should be 12 digit"],
        minlength: [12, "Should be 12 digit"],
    },
    panNumber:{
        type: Number,
        required: true,
        maxlength: [10, "Should be 10 digit"],
        minlength: [10, "Should be 10 digit"],
    },
    bankAccountNumber:{
        type: Number,
        required: true,
        maxlength: [17, "Should be at max 17 digit"],
        minlength: [9, "Should be at least 9 digit"],
    },
    ifsc:{
        type: Number,
        required: true,
        maxlength: [11, "Should be at max 11 digit"],
        minlength: [11, "Should be at least 11 digit"],
    },
    passBookNumber:{
        type: Number,
        required: true,
    },
    role:{
        type:String,
        default:"user"
    },
    designation:{
        type:String,
        default:"N/A"
    },
    password:{
        type:String,
        required:true
    },
    salt:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Pending"
    },
    imageUrl:{
        type:String,
        required:true
    }
  
});

module.exports =  mongoose.model('employee', EmployeeSchema);
