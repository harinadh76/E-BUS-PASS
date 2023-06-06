const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const driverSchema = new Schema({
    id:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    busno:{
        type:String,
        required:true
    },
    route:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("driver",driverSchema);