const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      cloudinary_id: {
        type: String,
      },


});

module.exports =  mongoose.model('user', UserSchema);