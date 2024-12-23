require('dotenv').config();
const jwt = require('jsonwebtoken')

const generateToken = (id)=>{
    return jwt.sign({id},process.env.TOKEN_KEY,{expiresIn : 30 * 24 * 60 * 60});
}

module.exports = generateToken;