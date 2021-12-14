var mongoose = require('mongoose')

const chatRoomSchema = mongoose.Schema({
    date : Date,
    content: String,
    author : String,
    room: String
});

var eventSchema = mongoose.Schema({
    chat_messages: [chatRoomSchema],
    token : String,
    dateInsert: Date,
    date: Date,
    title: String,
    planner: String,    
    guests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    description: String,
    placeName: String,
    placeAddress: String,
    placeType: String,
    placeNote: Number,
    budget: Number, 
    booking_status: String,
    capacity: Number,
    age : String,
})

var eventModel = mongoose.model('events', eventSchema)

module.exports = eventModel;