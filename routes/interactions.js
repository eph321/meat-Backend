var express = require('express');
const uid2 = require("uid2");
const router = express.Router();



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


/* GET users listing prior to adding a buddy  */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* GET users listing prior to adding a buddy  */

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



router.get('/list-related-users/:token',async function (req,res,next){
    let tokenHandlers = await userModel.find({buddies : req.params.token});
    let currentUser = await userModel.findOne({token: req.params.token});

    res.json({listOfRelations: tokenHandlers, currentUser: currentUser})
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

router.post('/decline-buddy', async function(req,res, next){
    let currentUser = await userModel.findOne({token : req.body.userToken});
    let otherUser = await userModel.find({token : req.body.token, buddies: req.body.userToken })
    //vérification si le token est déjà présent dans la liste de buddies.
    if(  otherUser.buddies.some((buddy) => buddy === req.body.token )){
        let tempFollowers = otherUser.buddies.filter((buddy) => buddy !== req.body.userToken)
        res.json({result: false})

    } else {
        currentUser.buddies = [...currentUser.buddies, req.body.token];
        var currentUserSaved = await currentUser.save();

        if(  otherUser  ){
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


module.exports = router;
