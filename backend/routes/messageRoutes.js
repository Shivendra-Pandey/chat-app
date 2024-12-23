const express = require('express');
const router = express.Router();
const User = require('../models/usermodel')
const Chat = require('../models/chatmodel');
const Message = require('../models/messagemodel');

router.post('/createMessage',async (req,res)=>{
    const {senderId,chatId,content} = req.body;
    try{
        const message = await Message.create({sender : senderId, chat : chatId, content});
        const chat = await Chat.findByIdAndUpdate(chatId,{
            latestMsg : message._id,
            $push : {messages : message._id},
        },{new : true});
        res.status(200).json({message , chat});
    }catch(err){
        res.status(400).json({error : err});
    }
})


module.exports= router;