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
    let receiverUser = await userModel.findOne({token : req.body.token});
    //vérification si le token est déjà présent dans la liste de buddies.
    if(  currentUser.buddies.some((buddy) => buddy.token === req.body.token ) && receiverUser.buddies.some((buddy) => buddy.token === req.body.userToken )){
        res.json({result: false})
    } else {
        currentUser.buddies = [...currentUser.buddies, {token : req.body.token, status: true}];
        receiverUser.buddies = [...receiverUser.buddies, {token : req.body.userToken, status: false}];
        var currentUserSaved = await currentUser.save();
        var receiverUserSaved = await receiverUser.save();

        res.json({ result: true, requester : currentUserSaved, receiver :receiverUserSaved });

    }

});


router.get('/list-related-users/:token',async function (req,res,next){
    let tokenHandlers = userModel.find({ buddies: { token: req.params.token } })
    let currentUser = await userModel.findOne({token: req.params.token});


    res.json({listOfRelations: tokenHandlers, currentUser: currentUser})
})

var roles = ["owner", "admin"];


router.post('/accept-buddy', async function(req,res, next){
    let currentUser = await userModel.findOne({token : req.body.userToken});
    let receiverUser = await userModel.findOne({token : req.body.token});

    currentUser.buddies = [...currentUser.buddies, {token : req.body.token, status: true}];
    receiverUser.buddies = [...receiverUser.buddies, {token : req.body.userToken, status: true}];
    var currentUserSaved = await currentUser.save();
    var receiverUserSaved = await receiverUser.save();

    res.json({ result: true, requester : currentUserSaved, receiver :receiverUserSaved });


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
