const { mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minLength:3,
        maxLength:255,
    },
    passwordHash:{
        type:String,
        required:true,
        unique:true,
        minLength:3,
        maxLength:1024,
    }, 
    isAdmin: {
        type: Boolean,
        default: false
      }
});

const User = mongoose.model('User',userSchema);
module.exports = User;