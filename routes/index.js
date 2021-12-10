const express = require('express');
const router = express.Router();
const eventModel = require('../models/events');



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

router.get('/search-table', async function(req,res,next){
  var result = await eventModel.find();

  res.json({result: result});
});

router.get('/filter-table/:placeType', async function(req,res,next){

console.log(req.params.placeType)

  var result = await eventModel.find({placeType: { $all: [req.params.placeType] }})
  console.log(result)
 res.json({result})
})

router.get('/join-table/:_id', async function(req,res,next){
  var result = await eventModel.findOne({_id : req.params._id});

  res.json({result: result});

});


module.exports = router;


