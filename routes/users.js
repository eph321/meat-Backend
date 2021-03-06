var express = require('express');
const router = express.Router();

const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const uniqid = require('uniqid');
const fs = require('fs');
const userModel = require('../models/users');
const conversationModel = require('../models/conversations')
const eventModel = require("../models/events");

var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: "da3gufsec",
  api_key: "713285779721675",
  api_secret: "y22CviNN8xuHOULwdIwT5hvcCFk",
  secure: true,
})





/* GET users listing. */
// ROUTE POUR SIGN UP

router.post('/sign-up', async function (req, res, next) {
  const cost = 10;
  const hash = bcrypt.hashSync(req.body.password, cost);

  var searchUser = await userModel.findOne({
    email: req.body.email
  })

  // SI LE MAIL N'EXISTE PAS CREER UN NOUVEAU COMPTE avec TOKEN + HASH DU MDP

  if (!searchUser) {
    var newUser = new userModel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      dateofbirth:req.body.dateofbirth,
      gender: req.body.gender,
      addresses: req.body.addresses,
      avatar: req.body.avatar,
      phone : req.body.phone,
      preference1: req.body.preference1,
      preference2: req.body.preference2,
      preference3: req.body.preference3,
      description: req.body.description,
      password: hash,
      token: uid2(32),
    })

    var newUserSave = await newUser.save()}
  console.log(newUserSave)

  res.json({result:newUserSave ? true : false, newUserSave });
});


//ROUTE SIGN in

router.post('/sign-in', async function (req, res, next) {

  var searchUser = await userModel.findOne({
    email: req.body.email
  })

  if (bcrypt.compareSync(req.body.password, searchUser.password)) {
    res.json({ login: true, searchUser });
  } else {
    res.json({ login: false });
  }
});


router.post('/upload-avatar', async function(req, res, next) {

  let pictureName = `./tmp/${uniqid()}.jpg`
  let resultCopy = await req.files.avatar.mv(pictureName);
  if(!resultCopy) {
    let resultCloudinary = await cloudinary.uploader.upload(pictureName);
    console.log(resultCloudinary.url)
    res.json({cloud : resultCloudinary });
  } else {
    res.json({error: resultCopy});
  }

  fs.unlinkSync(pictureName);
});


router.get('/search-user', async function(req,res,next){
  let result = await userModel.find();
  res.json({result: result});
});

router.get('/search-userId/:userToken', async function(req,res,next){
  let result = await userModel.findOne({token : req.params.userToken});
  res.json({result: result});
});


router.put('/update-account', async function(req,res,next){
  let updatedUser = await userModel.findOne({token: token})

  if (existingUser) {
    updatedUser.email = req.body.email,
    updatedUser.password = req.body.password,
    updatedUser.firstname = req.body.firstname,
    updatedUser.lastname = req.body.lastname,
    updatedUser.addresses = req.body.addresses,
    updatedUser.phone = req.body.phone,
    updatedUser.preference1 = req.body.preference1,
    updatedUser.preference2 = req.body.preference2,
    updatedUser.preference3 = req.body.preference3,
    updatedUser.description = req.body.description,
    updatedUser.gender = req.body.gender
  }
  
    let newUserData = await existingUser.save()
  
  res.json({});
});





module.exports = router;
