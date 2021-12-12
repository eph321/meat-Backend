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
  var result = await eventModel.find();

  res.json({ result: result });
});

router.get('/filter-table/:placeType', async function (req, res, next) {

  console.log("req-params", typeof req.params.placeType)

  const paramsFromFront = req.params.placeType // string
  const params = paramsFromFront.split(",") // tableau

  var result = await eventModel.find({ placeType: { $in: params } })
if(params.length===0){
  var result = await eventModel.find()
}
  res.json({ result })
})




router.get('/join-table/:_id', async function (req, res, next) {
  var result = await eventModel.findOne({ _id: req.params._id });

  res.json({ result: result });

});
module.exports = router;


