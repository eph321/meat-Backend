var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const userModel = require('../models/users');
const chatModel = require('../models/chats');
const eventModel = require('../models/events');
var bcrypt = require('bcrypt');
var uid2 = require('uid2');

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
      password: hash,
      token: uid2(32),

    })
  
    var newUserSave = await newUser.save()};
  
  res.json({result:newUserSave ? true : false, newUserSave });
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

module.exports = router;
