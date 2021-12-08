var mongoose = require('mongoose');
const { request } = require('../app');

var chatSchema = mongoose.Schema({
    date : Date,
    content: String,
    author : String,
   });

var requestSchema = mongoose.Schema({
    userToken: String,
    requestGranted : Boolean
})   

var conversationSchema = mongoose.Schema({    
    chat: [chatSchema],
    requestStatus : [requestSchema],
    conversationToken : String,
    conversationRequest : Boolean,
    user_id : [{type : mongoose.Schema.Types.ObjectId, ref: 'users'}]
    
})

var conversationModel = mongoose.model('conversations', conversationSchema)

module.exports = conversationModel;