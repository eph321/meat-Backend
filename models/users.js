var mongoose = require('mongoose')

var messageSchema = mongoose.Schema({
    status : String,
    date : Date,
    sender : String,
    content: String,
    receiver: String,
   });
 

var userSchema = mongoose.Schema({
    token : String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    password: String,
    gender: String,
    email: String,
    addresses: String,
    avatar: String,
    phone : String,
    preference1: String,
    preference2: String,
    preference3: String,
    description : String,
    userNote : Number,
    plannerNote : Number,
    messages: [messageSchema],
    event_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
    favouriteBuddies : [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    chat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'chats' }],
    conversations_id : [{type : mongoose.Schema.Types.ObjectId, ref: 'conversations'}]

  
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;