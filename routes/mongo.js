const mongoose = require('mongoose')


const Schema = mongoose.Schema;

const dataSchema = new Schema({
    nickname:{
        type:String,
        required: true
    },
    content:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
}, { timestamps:true });

const DB = mongoose.model('DB', dataSchema)

module.exports = DB