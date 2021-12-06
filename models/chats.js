var mongoose = require('mongoose')

var chatSchema = mongoose.Schema({
    date: Date,
    content: String,
    event_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
    from: String,
   
})

var chatModel = mongoose.model('chats', chatSchema)

module.exports = chatModel;