var mongoose = require('mongoose')

var messageSchema = mongoose.Schema({
    status : String,
    date : Date,
    sender : String,
    content: String,
    receiver: String,
   });

var buddiesSchema = mongoose.Schema({
    token : String,
    status : Boolean,
});


var userSchema = mongoose.Schema({
    token : String,
    firstname: String,
    lastname: String,
    dateofbirth: Date,  
    password: String,
    gender: String,
    email: String,
    addresses: String,
    latitude: Number,
    longitude: Number,
    avatar: String,
    phone : String,
    preferences: Array,
    preference1: String,
    preference2: String,
    preference3: String,
    description : String,
    userNote : Number,
    plannerNote : Number,
    messages: [messageSchema],
    event_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
    buddies: [buddiesSchema],
    favouriteBuddies : [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    chat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'chats' }],


  
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;