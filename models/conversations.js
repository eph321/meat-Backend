const mongoose = require('mongoose');


const chatSchema = mongoose.Schema({
    date : Date,
    content: String,
    author : String,
   });



const conversationSchema = mongoose.Schema({
    chat: [chatSchema],
    talkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],

    
})

const conversationModel = mongoose.model('conversations', conversationSchema)

module.exports = conversationModel;