require('dotenv').config();
const mongoose = require('mongoose');
const connnectDB = ()=>{
    mongoose.connect(process.env.DB_URL,{
        useUnifiedTopology : true,
        useNewUrlParser : true
    }).then(()=>{
        console.log('connected to db');
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports = connnectDB