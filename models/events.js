var mongoose = require('mongoose')


var placeSchema = mongoose.Schema({
    type : String,
    name : String,
    adress : String,
    note: String,
   });
 


var eventSchema = mongoose.Schema({
    token : String,
    dateInsert: Date,
    date: Date,
    title: String,
    planner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],    
    guests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    description: String,
    place: [placeSchema],
    budget: Number , 
    booking_status: String,
    capacity: Number,
})

var eventModel = mongoose.model('events', eventSchema)

module.exports = eventModel;