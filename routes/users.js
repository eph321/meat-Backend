var express = require('express');

const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const router = express.Router();
const fs = require('fs');
const userModel = require('../models/users');
const conversationModel = require('../models/conversations')

var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: "da3gufsec",
  api_key: "713285779721675",
  api_secret: "y22CviNN8xuHOULwdIwT5hvcCFk",
  secure: true,
})





/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


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

router.post('/list-related-users',async function (req,res,next){
  let tokenHandlers = await userModel.find({buddies : req.body.userToken});

  res.json({listOfRelations: tokenHandlers})
})

router.post('/accept-buddy', async function(req,res, next){
  let currentUser = await userModel.findOne({token : req.body.userToken});
  let otherUser = await userModel.find({token : req.body.token, buddies: req.body.userToken })
  //vérification si le token est déjà présent dans la liste de buddies.
  if(  currentUser.buddies.some((buddy) => buddy === req.body.token )){
    res.json({result: false})
  } else {
    currentUser.buddies = [...currentUser.buddies, req.body.token];
    var currentUserSaved = await currentUser.save();

    if(  otherUser !== null ){
      let  newConversation = new conversationModel({
        conversationToken :  uid2(32)           })}


    res.json({ result: true, buddies : currentUserSaved });
  }

});
router.get('/load-chat-messages',async function(req,res,next){
  conversationModel.find( { tags: { $all: [req.body.token, req.body.userToken] } } )

})
router.get('update-chat-messages',async function (req,resn,next){

})

router.get('/search-user', async function(req,res,next){
  let result = await userModel.find();
  res.json({result: result});
});

router.post('/add-buddy', async function(req,res, next){
  let currentUser = await userModel.findOne({token : req.body.userToken});
  //vérification si le token est déjà présent dans la liste de buddies.
  if(  currentUser.buddies.some((buddy) => buddy === req.body.token )){
    res.json({result: false})
  } else {
    currentUser.buddies = [...currentUser.buddies, req.body.token];
    var currentUserSaved = await currentUser.save();

    res.json({ result: true, buddies : currentUserSaved });

  }

});

module.exports = router;
