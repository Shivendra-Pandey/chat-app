const express = require('express');
const router = express.Router();
const User = require('../models/usermodel')
const generateToken = require('../db/generateToken')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.get('/allusers',async (req,res) => {
    let {username} = req.query;
    username = username.trim();
    try{
        const users = await User.find({username : {$regex : username, $options : "i"}});
        res.status(200).json({users});
    }catch(err){
        res.status(400).json({message : 'No such user exists !'});
    }
})

router.post('/signup',async (req,res) =>{
    const {username , email , password } = req.body;
    
    try{

        const existingUser = await User.findOne({email});

        if(existingUser){
            res.status(400).json({message : 'Email already in use ! '});
        }else{

        const user = await User.create({
            username,email,password
        })

        if(user){
            const token = generateToken(user._id);
            res.cookie("token ", token ,{
                withCredentials : true,
                httpOnly : false
            }).status(200).json({
            user,token
            });
        }
      }
    }catch(err){
        res.status(400).json({message : err});
    }
})


router.post('/login', async (req,res) =>{
    const { email , password } = req.body;
    
    try{
        const user = await User.findOne({email});
        if(user){
            const auth = await bcrypt.compare(password, user.password)
            if (!auth) {
                res.status(400).json({message:'Incorrect password or email' }) 
            }else{
                const token = generateToken(user._id);
                res.cookie("token ", token,{
                    withCredentials : true,
                    httpOnly : false
                }).status(200).json({
                user,token
                });
            }
        }else{
            res.status(400).json({message : ' No such user exists !'})
        }
    }catch(err){
        res.status(400).json({error : err});
    }
})


router.post('/verify',(req, res) => {
    
    const {token} = req.body;

    if (!token) {
      return res.json({ status: false })
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
      if (err) {
       return res.json({ status: false })
      } else {
        const user = await User.findById(data.id)
        if (user) return res.json({ status: true, user })
        else return res.json({ status: false })
      }
    })
    
})

module.exports = router;