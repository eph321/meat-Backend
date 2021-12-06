var mongoose = require('mongoose')
var MessageSchema = mongoose.Schema({
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
    dateOfBirth: Number,
    password: hash,
    gender: Number,
    email: String,
    adresses: String,
    avatar: String,
    phone : String,
    // preference : String,
    description : String,
    userNote : String,
    plannerNote : String,
    messages: [MessageSchema],
    event_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
    favouriteBuddies : Boolean,
    chat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'chats' }],

  
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;