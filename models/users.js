var mongoose = require('mongoose')

var messageSchema = mongoose.Schema({
    status : String,
    date : Date,
    sender : String,
    content: String,
    receiver: String,
   });
 

var userSchema = mongoose.Schema({
    token : uid2(32),
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    password: hash,
    gender: String,
    email: String,
    adresses: String,
    avatar: String,
    phone : String,
    // preference : String,
    description : String,
    userNote : Number,
    plannerNote : Number,
    messages: [messageSchema],
    event_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
    favouriteBuddies : [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    chat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'chats' }],

  
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;