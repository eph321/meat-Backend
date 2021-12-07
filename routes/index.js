var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const userModel = require('../models/users');
const chatModel = require('../models/chats');
const eventModel = require('../models/events');
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

// ROUTE POUR SIGN UP

router.post('/sign-up', async function(req, res, next) {
  const cost = 10;
  const hash = bcrypt.hashSync(req.body.password, cost);

  var searchUser = await userModel.findOne({
    email: req.body.email
  })

  // SI LE MAIL N'EXISTE PAS CREER UN NOUVEAU COMPTE avec TOKEN + HASH DU MDP

  if(!searchUser){
    var newUser = new userModel({
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      email: req.body.email,
      dateOfBirth:req.body.dateOfBirth,
      gender: req.body.gender,
      addresses: req.body.addresses,
      avatar: req.body.avatar,
      phone : req.body.phone,
      preference1: req.body.preference1,
      preference2: req.body.preference2,  
      preference3: req.body.preference3,
      password: hash,
      token: uid2(32),
    })
  
    var newUserSave = await newUser.save()};
    console.log(newUserSave)
  
  res.json({result:newUserSave ? true : false, newUserSave });
});

//ROUTE UPLOAD AVATAR

router.post('/uploadAvatar', async function(req, res, next) {
  
  var pictureName = './tmp/'+uniqid()+'.jpg';
  var resultCopy = await req.files.avatar.mv(pictureName);
  if(!resultCopy) {
    let resultCloudinary = await cloudinary.uploader.upload(pictureName);
    console.log(resultCloudinary)
    res.json({cloud : resultCloudinary });
  } else {
    res.json({error: resultCopy});
  }

  fs.unlinkSync(pictureName);
  
});

//ROUTE SIGN UP

router.post('/sign-in', async function(req,res,next){

  var searchUser = await userModel.findOne({
    email: req.body.email
  })

  if (bcrypt.compareSync(req.body.password, searchUser.password)) {
    res.json({ login: true, searchUser });
    } else {
    res.json({ login: false });
  }


  
});

//route pour ajouter la table

router.post('/add-table', async function(req,res,next){

  
  var addTable = new eventModel({
      date: req.body.date,
      title:req.body.title,
      place:req.body.place.name,
      address:  req.body.place.adress,
      type: req.body.place.type,
      description: req.body.description,
      age : req.body.age,
      capacity : req.body.capacity,
      budget : req.body.budget,
      token : req.body.token


      
  }); 
  
  var newTable = await addTable.save();
  res.json({result:newTable ? true : false, newTable });
});

module.exports = router;
