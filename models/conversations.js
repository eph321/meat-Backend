const mongoose = require('mongoose');


const chatSchema = mongoose.Schema({
    date : Date,
    content: String,
    author : String,
   });



const conversationSchema = mongoose.Schema({
    chat: [chatSchema],
    conversationToken : String,

    
})

const conversationModel = mongoose.model('conversations', conversationSchema)

module.exports = conversationModel;