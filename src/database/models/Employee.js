const validator = require("validator");

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxlength: [30, "Name cannot exceed 70 characters"],
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
    
    // identities:[
    //     {
    //         userId:{
    //             type: Schema.Types.ObjectId,
    //             ref: "identity",
    //             required: true,
    //         },
    //         idName:{
    //             type:String,
    //             required: true
    //         },
    //         value:{
    //             type:Number,
    //             required:true
    //         },
            
    //     }

    // ],
    adhaarNumber:{
        type: Number,
        required: true,
    },
    panNumber:{
        type: Number,
        required: true,
    },
    bankAccountNumber:{
        type: Number,
        required: true,
    },
    ifsc:{
        type: Number,
        required: true,
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
        required:true
    },
    password:{
        type:String,
        required:true
    },
    salt:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    }
  
});

module.exports =  mongoose.model('employee', EmployeeSchema);
