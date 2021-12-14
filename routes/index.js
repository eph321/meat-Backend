var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const userModel = require('../models/users');
const chatModel = require('../models/chats');
const eventModel = require('../models/events');
const conversationModel = require('../models/conversations')
var bcrypt = require('bcrypt');
var uid2 = require('uid2');
var fs = require('fs');

var cloudinary = require('cloudinary').v2;
const { updateOne } = require('../models/users');
cloudinary.config({
  cloud_name: "da3gufsec",
  api_key: "713285779721675",
  api_secret: "y22CviNN8xuHOULwdIwT5hvcCFk",
  secure: true,
})





//route pour ajouter la table

router.post('/add-table', async function (req, res, next) {

  var addTable = new eventModel({
    date: req.body.date,
    title: req.body.title,
    placeName: req.body.placeName,
    placeAddress: req.body.placeAddress,
    placeType: req.body.placeType,
    placeNote: req.body.placeNote,
    description: req.body.description,
    age: req.body.age,
    capacity: req.body.capacity,
    budget: req.body.budget,
    token: req.body.token, // A supprimer
    planner: req.body.planner
  });

  var newTable = await addTable.save();
  res.json({ result: newTable ? true : false, newTable });
});

router.get('/search-table', async function (req, res, next) {

  console.log(new Date(Date.now()))
  var result = await eventModel.find({date: 
                                      {$gte: new Date(Date.now()).toISOString()}})
                                      .sort({date:1});

  res.json({ result: result });
});

router.get('/my-events/:token', async function(req, res, next) {
  
  const user = await userModel.findOne({token : req.params.token})

  var result = await eventModel.aggregate([
    {$match:
    {$or: [{planner: req.params.token},
          {guests: user._id}]
    }},
    {$sort: {date:1}}
  ])

  res.json({result})
})

router.get('/filter-table/:placeType', async function (req, res, next) {

  const paramsFromFront = req.params.placeType // string
  const params = paramsFromFront.split(",") // tableau

  var result = await eventModel.find({ placeType: { $in: params } })

  res.json({ result })
})

/// FILTRE  Où ? Homescreen

/* router.get('/filter-date/:date', async function (req, res, next) {

  console.log("req-params", typeof req.params.date)

  const paramsFromFront = req.params.date  
  const jsonDate = new Date(paramsFromFront)
 console.log(jsonDate)

 var result = await eventModel.find({ date: { $date: jsonDate } }) 


  //var result = await eventModel.find({ placeType: { $in: params } })

  res.json({ result })
}) */




router.get('/join-table/:_id/', async function (req, res, next) {
  var result = await eventModel.findOne({ _id: req.params._id });

  res.json({ result: result, user: user });

});


router.post('/enter-table', async function(req, res, next) {


  var table = await eventModel.findById(req.body.id);

  var user = await userModel.findOne({token : req.body.token});
  table.guests.push(user.id)

  table = await table.save();
  

  res.json({table });
 
 });

 router.delete('/delete-guest/:tableId/:token', async function(req,res,next){
  
  var table = await eventModel.findById(req.params.tableId);

  var user = await userModel.findOne({token : req.params.token});


  table.guests =  table.guests.filter(e => e != user.id);

  table = await table.save();

  res.json({table});
});
module.exports = router;


