const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const messageSchema = new mongoose.Schema({
    senderid: {
        type: String,
        required: true
    },
    message:{
        type: String,
    },
    roomid:{
        type: String,
        required: true
    },
    recieverid:{
        type: String,
        required: true
    }
},{
    timestamps: true
})




const Message = mongoose.model("Message", messageSchema);
module.exports = Message;