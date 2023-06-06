
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buspassSchema = new Schema({
    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true
    },
    branch:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    route:{
        type:String,
        required:true
    },
    rollno:{
        type:String,
        required:true
    },
    busno:{
        type:String,
        required:true
    },
    phno:
    {
        type:Number,
        required:true
    },
    address:
    {
        type:String,
        required:true
    },
    date:{
       type:String,
        required:false

    },
    datevalid:{
        type:String,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("buspass",buspassSchema);