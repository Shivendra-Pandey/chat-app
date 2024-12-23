const express = require('express');
const router = express.Router();
const User = require('../models/usermodel')
const Chat = require('../models/chatmodel');
const Message = require('../models/messagemodel');

router.post('/allchats',async(req,res)=>{
    const {userId} = req.body;
    try{
        let allchats = await Chat.find({users :{$in : userId}}).populate('users').populate('latestMsg').populate('messages');
        allchats = await User.populate(allchats, {path : 'messages.sender'});
        res.status(200).json({chats : allchats});
    }catch(err){
        res.status(400).json({error : err});
    }
})

router.post('/createchat',async (req,res)=>{
    const {userId1, userId2} = req.body;
    try{
        const chat = await Chat.create({ users : [userId1,userId2]});
        res.status(200).json({chat});
    }catch{
        res.status(400).json({error : err});
    }
})

router.post('/createGroup',async (req,res)=>{
    const {users,chatName} = req.body;
    try{
        const groupchat = await Chat.create({users, chatName, isGroupChat : true, admin : users[0]});
        res.status(200).json({groupchat});
    }catch(err){
        res.status(400).json({error : err});
    }
})

router.post('/addUser', async (req,res)=>{
    const {userId,chatId} = req.body;
    try{
        const chat = await Chat.findById(chatId);
        if(!chat.users.includes(userId)){
          chat.users.push(userId);
          chat.save();
        }
        res.status(200).json({chat});
    }catch(err){
        res.status(400).json({error : err});
    }
})

router.post('/removeUser',async (req,res)=>{
    const {userId,chatId} = req.body;
    try{
        const chat = await Chat.findById(chatId);
        chat.users.pull(userId);
        chat.save();
        res.status(200).json({chat});
    }catch(err){
        res.status(400).json({error : err});
    }
})


module.exports = router;


