const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    chatName : {
        type : String,
        trim : true
    },
    users : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    isGroupChat : {
        type : Boolean,
        required : true,
        default : false
    },
    admin : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    latestMsg : {
        type : Schema.Types.ObjectId,
        ref : 'Message'
    },
    messages : [{
        type : Schema.Types.ObjectId,
        ref : 'Message'
    }]
},{timestamps : true})

module.exports = mongoose.model('Chat',chatSchema);


