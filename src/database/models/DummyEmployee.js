const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DummyEmployeeSchema = new Schema({

    email:{
        type: String,
        required: true,
        unique:true,
    },
    status:{
        type: String,
        default: "pending",
    }

        
  
});

module.exports =  mongoose.model('dummyEmployees', DummyEmployeeSchema);