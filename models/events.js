var mongoose = require('mongoose')


var PlaceSchema = mongoose.Schema({
    photo : String,
    name : String,
    adress : String,
    note: String,
    // externalId: "theFORK"),
   });
 


var eventSchema = mongoose.Schema({
    token : uid2(32),
    dateInsert: Date,
    date: Date,
    title: String,
    planner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],    
    guests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    description: String,
    place: [PlaceSchema],
    budget: String , 
    booking_status: String,
    capacity: Number ,
})

var eventModel = mongoose.model('orders', eventSchema)

module.exports = eventModel;