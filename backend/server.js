require('dotenv').config();
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express();
const connnectDB = require('./db/configDB')
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
app.use((req,res,next)=>{
    console.log(req.method, req.url);
})
const server = app.listen(process.env.PORT,()=>{
    console.log(`listening to requests ${process.env.PORT}`);
})
connnectDB();

const io = require('socket.io')(server,{
    pingTimeout : 60000,
    cors : {
        origin : "http://localhost:3000",
    }
})

io.on('connection',(socket)=>{
    
    socket.on('setup',(userId)=>{
        socket.join(userId);
        console.log("connected")
    })

    socket.on('join',(chatId)=>{
        socket.join(chatId);
        console.log("joined room",chatId);
    })

    socket.on('sendMessage',({message,chat})=>{

        if(!chat.users) return console.log("no users in chat");

        chat.users.forEach((user)=>{
            if(user.toString()!=message.sender._id.toString())
            socket.in(chat._id).emit("receiveMessage",message);
        }) 

    })

    socket.off("setup",(userId)=>{
        socket.leave(userId);
        console.log("disconnected")
    })

})