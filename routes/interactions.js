var express = require('express');
const uid2 = require("uid2");
const router = express.Router();



const userModel = require('../models/users');

const conversationModel = require('../models/conversations')
const eventModel = require("../models/events");
const mongoose = require("mongoose");

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

router.get('/search-user', async function(req,res,next){
    let result = await userModel.find();
    res.json({result: result});
});

router.post('/add-buddy', async function(req,res, next){
    //Demande d'ami par l'user


    let currentUser = await userModel.findOne({token : req.body.userToken});
    let receiverUser = await userModel.findOne({token : req.body.token});
    //vérification si le token est déjà présent dans la liste de buddies.
    if(  currentUser.buddies.some((buddy) => buddy.token === req.body.token ) && receiverUser.buddies.some((buddy) => buddy.token === req.body.userToken )){
        res.json({result: false})
    } else if (currentUser.token  === receiverUser.token ){
        res.json({result: false})
    } else  {
        currentUser.buddies = [...currentUser.buddies, {token : req.body.token, status: true}];
        receiverUser.buddies = [...receiverUser.buddies, {token : req.body.userToken, status: false}];
        let currentUserSaved = await currentUser.save();
        let receiverUserSaved = await receiverUser.save();

        res.json({ result: true, requester : currentUserSaved, receiver :receiverUserSaved });

    }

});


router.get('/list-related-users/:token',async function (req,res,next){
    let tokenHandlers = await userModel.find({buddies : { $all: [ { "$elemMatch" : {token: req.params.token}}]}})
    let currentUser = await userModel.findOne({token: req.params.token});


    res.json({listOfRelations: tokenHandlers, currentUser: currentUser})
})

var roles = ["owner", "admin"];


router.post('/accept-buddy', async function(req,res, next){
    let currentUser = await userModel.findOne({token : req.body.userToken});
    let receiverUser = await userModel.findOne({token : req.body.token});
    let receiverIndex = currentUser.buddies.map((el) => el.token).indexOf(req.body.token)
    currentUser.buddies[receiverIndex].status = true;
    let currentUserSaved = await currentUser.save();

    console.log(receiverIndex);

        // var receiverUserSaved = await receiverUser.save();

        res.json({ result: true, requester : currentUserSaved, receiver :receiverUser });


});

router.post('/decline-buddy', async function(req,res, next){
    // récupère l'user et l'user qui a fait une demande d'ami :

    let currentUser = await userModel.findOne({token : req.body.userToken});
    let receiverUser = await userModel.findOne({token : req.body.token});

    //vérification si le token est déjà présent dans la liste de buddies.
    if(  currentUser.buddies.some((buddy) => buddy.token !== req.body.token ) && receiverUser.buddies.some((buddy) => buddy.token !== req.body.userToken )){
        res.json({result: false})
    } else {
        currentUser.buddies = [...currentUser.buddies.filter((buddy) => buddy.token !== req.body.token)];
        receiverUser.buddies = [...receiverUser.buddies.filter((buddy) => buddy.token !== req.body.userToken)];
        let currentUserSaved = await currentUser.save();
        let receiverUserSaved = await receiverUser.save();

        res.json({ result: true, requester : currentUserSaved, receiver :receiverUserSaved });

    }

});


router.post('/conversation',async function(req,res,next){
    let currentUser = await userModel.findOne({token : req.body.userToken});
    let receiverUser = await userModel.findOne({token : req.body.token});

    let conversationExists = await conversationModel.find({talkers : { $all: [ currentUser.id,receiverUser.id]}})
    if(conversationExists.length !== 0){

        res.json({ result: false,conv : conversationExists[0]._id  });
    } else {
        let newConversation = new conversationModel({
        })
        newConversation.talkers = [currentUser.id,receiverUser.id];

        let savedConversation = await newConversation.save()

        res.json({ result: true,conv: savedConversation[0]._id  });
    }


})

router.get("/list-chat-messages/:conversation/:token",async function(req,res,next){
    let userConversation = await conversationModel.findById( req.params.conversation).populate("talkers").exec();
    let userIndex = userConversation.talkers.map((el) => el.token).indexOf(req.params.token)
    let author = userConversation.talkers[userIndex].firstname;


    res.json({chatMessages : userConversation.chat, author : author})

})

router.post('/update-messages', async function(req,res, next){
    let userConversation = await conversationModel.findById( req.body.conversation)
    userConversation.chat = [...userConversation.chat, {content: req.body.content, date : req.body.date, author: req.body.author,conversation:req.body.conversation}]
    let savedConversation = await userConversation.save()


    res.json({ result: true, conversation : savedConversation });


});




module.exports = router;
