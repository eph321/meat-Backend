var mongoose = require('mongoose')

var chatSchema = mongoose.Schema({
    date : Date,
    content: String,
    author : String,
   });

var conversationSchema = mongoose.Schema({    
    chat: [chatSchema],
    conversationToken : String,
    conversationRequest : Boolean,
    user_id : [{type : mongoose.Schema.Types.ObjectId, ref: 'users'}]
    
})

var conversationModel = mongoose.model('conversations', conversationSchema)

module.exports = conversationModel;