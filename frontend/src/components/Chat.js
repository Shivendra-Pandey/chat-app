
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import { FaCheck } from "react-icons/fa";
import MyChat from './myChat';
import RecievedMessage from './RecievedMessage';
import SentMessage from './SentMessage';
import CreateGroupChat from './CreateGroupChat';
import OneonOneChat from './OneonOneChat';
import AddUser from './AddUser';
import RemoveUser from './RemoveUser';
import io from "socket.io-client";


var socket;
const Endpoint  = "http://localhost:5000";

function Chat(){
    
    const {chats , setChats , user , selectedChat , setSelectedChat, groupChatButton, setGroupChatButton, newChat, setNewChat, showMembers, setShowMembers, addMembers, setAddMembers} = useContext(UserContext);
    const [messages,setMessages] = useState([])
    const [newMessage,setNewMessage] = useState("");
    const [isSmallScreen,setIsSmallScreen] = useState(false);
    

    useEffect(()=>{
      socket = io(Endpoint);
      if(user){
        socket.emit("setup",user._id);
      }
      if(selectedChat!=""){
        socket.emit("join",selectedChat);
      }
    },[selectedChat,user])

    useEffect(()=>{
      socket.on("receiveMessage",(message)=>{
        if(selectedChat==message.chat) {
          setMessages([...messages,message]);
        }
        else{
          console.log("recieved message",message);
        }
      })
    })

    const getChats = async () =>{
        const response = await fetch("http://localhost:5000/api/chat/allchats",{
            method : "POST",
            body : JSON.stringify({userId : user._id}),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        const data = await response.json();
        setChats(data.chats);
        const chatArray = chats.filter((chat)=>chat._id===selectedChat);
        if(chatArray.length>=1){
            setMessages(chatArray[0].messages);
        }else{
            setMessages([]);
        }
        console.log(user,chats,selectedChat,messages)
    }
    const handlesendMessage = async () =>{
        if(newMessage==="")
        return;
        setMessages([...messages,{
        sender : user,
        content : newMessage,
        chat: selectedChat
        }])
        const response = await fetch("http://localhost:5000/api/message/createMessage",{
            method : "POST",
            body : JSON.stringify({senderId : user._id , chatId : selectedChat , content : newMessage}),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        const data = await response.json();
        socket.emit("sendMessage",{message : {
          sender : user,
          content : newMessage,
          chat: selectedChat
        } , chat : data.chat});
        setNewMessage("");
    }


    console.log("chats",chats);

    const updateChatList = async () =>{
        const response = await fetch("http://localhost:5000/api/chat/allchats",{
            method : "POST",
            body : JSON.stringify({userId : user._id}),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        const data = await response.json();
        setChats(data.chats);
    }

    useEffect(()=>{
      getChats(); 
    },[user, selectedChat])

    setTimeout(()=>{
        updateChatList();
    },2000)

    return(
      <div className="flex w-screen h-screen">
        <div className="w-[100%] md:w-[30%] h-full overflow-scroll px-2 py-2 bg-green-700 flex flex-col items-center">
          <div className='flex w-full justify-between min-h-[7%] my-1'>
          <button className='mr-auto text-white bg-blue-300 py-2 px-2  rounded-lg min-h-full' onClick={()=>{setGroupChatButton(true)}}>New Group Chat</button>
          <button className='ml-auto text-white bg-blue-300 py-2 px-2  rounded-lg min-h-full' onClick={()=>{setNewChat(true)}}>New Chat</button>
          </div>
          {/* <div className="w-[100%] min-h-[7%] bg-white my-1 rounded-lg ">
            <input placeholder="Search Chats " className="h-full w-full px-2 focus:outline-none" ></input>
          </div> */}
          {
            chats.map((chat,i)=>{
                return <MyChat key={i} message={chat._id==selectedChat && messages.length>=1 ? messages[messages.length-1].content : (chat.messages.length>=1 ? chat.messages.at(-1).content : " " )}  sender={chat.isGroupChat ? chat.chatName : ( chat.users[0]._id==user._id ? chat.users[1].username : chat.users[0].username) }  id={chat._id} ></MyChat>
            })
          }
        </div>
        <div className="w-[100%] md:w-[70%] h-full  md:px-2 pt-2 bg-red-500 flex flex-col justify-end"> 
        { 

        
        
        chats.filter((chat)=>chat._id===selectedChat).length>=1 && chats.filter((chat)=>chat._id===selectedChat)[0].isGroupChat && chats.filter((chat)=>chat._id===selectedChat)[0].admin===user._id &&


        
         <div className='flex absolute top-4 space-x-2 right-4 '>
          <button className='mr-auto text-white bg-blue-300 py-2 px-2 mx-1 rounded-lg min-h-full'  onClick={()=>{setAddMembers(true); setShowMembers(false)}} >Add User</button>
          <button className='ml-auto text-white bg-blue-300 py-2 px-2  rounded-lg min-h-full' onClick={()=>{setShowMembers(true); setAddMembers(false)}} >Remove User</button>
        </div>
      }
        
        {
          groupChatButton && <CreateGroupChat ></CreateGroupChat>
        }
        {
          newChat && <OneonOneChat></OneonOneChat>
        }
        {
          addMembers && <AddUser></AddUser>
        }
        {
          showMembers && <RemoveUser></RemoveUser>
        }
          { !groupChatButton && selectedChat!="" && !newChat && !showMembers && !addMembers &&
            messages.map((message,i)=>{
                return message.sender._id===user._id ? <SentMessage key={i} message={message.content}></SentMessage> : <RecievedMessage key={i} message={message.content} sender={message.sender}></RecievedMessage>
            })
          }
          {selectedChat!="" && !groupChatButton && !newChat && !showMembers && !addMembers && <div className="flex  h-[10%] w-full my-1 items-end space-x-2 ">
            <textarea className="w-[90%] focus:outline-none break-words overflow-scroll px-2 " placeholder="Type a message"  value={newMessage} onChange={(e)=>{setNewMessage(e.target.value)}}></textarea>
            <button type='submit' className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white"  onClick={handlesendMessage}><FaCheck/></button>
          </div>}
        </div>
      </div>
    );
}

export default Chat