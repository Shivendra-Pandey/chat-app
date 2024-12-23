const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        requied : true,
    },
    chats : [{
        type : Schema.Types.ObjectId,
        ref : 'Chat'
    }]
},{timestamps : true})

userSchema.pre('save', async function(){
    try{
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password,salt);
    }catch(err){
        console.log(err);
    }
})

module.exports = mongoose.model('User',userSchema);



