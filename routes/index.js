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
    planner: req.body.planner
  });

  var newTable = await addTable.save();
  res.json({ result: newTable ? true : false, newTable });
});

router.get('/search-table', async function (req, res, next) {

  //Afficher uniquement les events non passées
  var result = await eventModel.find({
    date:
      { $gte: new Date(Date.now()).toISOString() }
  })
    .sort({ date: 1 });

  res.json({ result: result });
});

router.get('/my-events/:token', async function (req, res, next) {

  const user = await userModel.findOne({ token: req.params.token })

  var result = await eventModel.aggregate([
    {
      $match:
      {
        $or: [{ planner: req.params.token },
        { guests: user._id }]
      }
    },
    { $sort: { date: 1 } }
  ])

  res.json({ result })
})

/* router.get('/filter-table/:placeType', async function (req, res, next) {

  const paramsFromFront = req.params.placeType // string
  const params = paramsFromFront.split(",") // tableau

  var result = await eventModel.find({
    placeType: { $in: params },
    date: { $gte: new Date(Date.now()).toISOString() }
  })

  res.json({ result })
}) */

/// FILTRE  Où ? Homescreen
////////// PARAMS
/* router.get('/filter-data/:date/:type', async function (req, res, next) {

  const dateFromFront = req.params.date

  var startDate = new Date(dateFromFront); // this is the starting date that looks like ISODate("2014-10-03T04:00:00.188Z")

  startDate.setSeconds(0);
  startDate.setHours(0);
  startDate.setMinutes(0);

  var endDate = new Date(dateFromFront);
  endDate.setHours(23);
  endDate.setMinutes(59);
  endDate.setSeconds(59); */

/* {
  $project: { date: { $ifNull: ["$date", "Unspecified"] } },
              placeType: {$ifNull: ["$placeType", "Unspecified"]}

}, */

/* var result = await eventModel.aggregate([
  {
    $match:
    {
      $and: [{
        date: {
          $gte: startDate,
          $lte: endDate
        },
        placeType: req.params.type
      }
      ]
    }
  },
  { $sort: { date: 1 } }
])
console.log(result, "result")

res.json({ result })
}) */


router.post('/filters', async function (req, res, next) {

  if (req.body.date != null && req.body.type != "") {

    let startDate = new Date(req.body.date); // this is the starting date that looks like ISODate("2014-10-03T04:00:00.188Z")

    startDate.setUTCSeconds(0);
    startDate.setUTCHours(0);
    startDate.setUTCMinutes(0);

    let endDate = new Date(req.body.date);
    endDate.setUTCHours(23);
    endDate.setUTCMinutes(59);
    endDate.setUTCSeconds(59);

    let filteredData = await eventModel.aggregate([
      {
        $match:
        {
          $and: [{
            date: {
              $gte: startDate,
              $lte: endDate
            },
            placeType: req.body.type
          }
          ]
        }
      },
      { $sort: { date: 1 } }
    ])
    var result = filteredData
    console.log("Date+Type", result, req.body.type)

  } else if (req.body.date != null) {
    let startDate = new Date(req.body.date); // ISODate("2014-10-03T04:00:00.188Z")

    startDate.setUTCSeconds(0);
    startDate.setUTCHours(0);
    startDate.setUTCMinutes(0);

    let endDate = new Date(req.body.date);
    endDate.setUTCHours(23);
    endDate.setUTCMinutes(59);
    endDate.setUTCSeconds(59);

    let dateFilter = await eventModel.find({ date: { $gte: startDate, $lte: endDate } })
    var result = dateFilter
    console.log("Date", result)
  }
  else if (req.body.type != null) {
    const typeFromFront = req.body.type.split(",") // req.body.type = string => tableau

    let typeFilter = await eventModel.find({
      placeType: { $in: typeFromFront },
      date: { $gte: new Date(Date.now()).toISOString() }
    })

    var result = typeFilter
    console.log("Type", result)
  }

  res.json({ result })
})



router.get('/join-table/:_id/', async function (req, res, next) {
  var result = await eventModel.findOne({ _id: req.params._id });

  res.json({ result: result, user: user });

});


router.post('/enter-table', async function (req, res, next) {

  var table = await eventModel.findById(req.body.id);

  var user = await userModel.findOne({ token: req.body.token });
  if (table.guests.includes(user.id)){
    res.json({table, result: false})
  } else {
    table.guests.push(user.id)
    table = await table.save();
    res.json({ table ,result : true});
  }





});

router.delete('/delete-guest/:tableId/:token', async function (req, res, next) {

  var table = await eventModel.findById(req.params.tableId);

  var user = await userModel.findOne({ token: req.params.token });

  table.guests = table.guests.filter(e => e != user.id);

  table = await table.save();

  res.json({ table });
});
module.exports = router;


