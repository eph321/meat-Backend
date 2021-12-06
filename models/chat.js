var mongoose = require('mongoose')

var chatSchema = mongoose.Schema({
    date: Number,
    content: Number,
    event_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
    from: String,
   
})

var chatModel = mongoose.model('orders', chatSchema)

module.exports = chatModel;