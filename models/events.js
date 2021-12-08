var mongoose = require('mongoose')


var eventSchema = mongoose.Schema({
    token : String,
    dateInsert: Date,
    date: Date,
    title: String,
    planner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],    
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