import {useState, useContext, useEffect} from 'react';
import { UserContext } from '../context/userContext';


function RemoveUser(){
    
    const [newChatSearch,setNewChatSearch] = useState("");
    const [secondUser,setSecondUser] = useState();
    const {chats, user, selectedChat, setSelectedChat, setShowMembers} = useContext(UserContext);
    const [userList,setUserList] = useState([]);
    
    const currChat = chats.filter((chat)=>chat._id==selectedChat);
    let members = [];

    if(currChat.length>=1){
        members = currChat[0].users.map((user)=>user._id);
    }

    console.log(members);
    
    const handleRemoveUser= async () =>{  
        const response = await fetch("http://localhost:5000/api/chat/removeUser",{
            method : "POST",
            body : JSON.stringify({chatId: selectedChat , userId : secondUser}),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        const data = await response.json();
        console.log(data)
        setSelectedChat(data.chat._id);
        setShowMembers(false);
    }  
    
    useEffect(()=>{
        getUsers();
    },[newChatSearch])

    const getUsers = async () =>{
        const response = await fetch(`http://localhost:5000/api/user/allusers/?username=${newChatSearch}`)
        const data = await response.json();
        setUserList(data.users);
        console.log(userList)   
    }

    return(
            <div className="flex flex-col items-center w-[50%] h-full mx-auto my-auto justify-center px-2  overflow-scroll">
            <div className="w-[100%] min-h-[5%] bg-white my-1 rounded-lg ">
              <input placeholder="Search Users" className="h-full w-full px-2 focus:outline-none" value={newChatSearch} onChange={(e)=>{setNewChatSearch(e.target.value)}} ></input>
            </div>
            { 
              userList.length &&  userList.filter((e)=>(e._id!=user._id && members.find((member)=>member==e._id))).map((e)=>{ 
                return(
                  <div className="flex w-[100%] my-1 rounded-md min-h-[5%] bg-white shadow-lg cursor-pointer px-2 justify-between items-center">
                    <div className="flex w-[100%] justify-between items-center">
                      <div className="flex flex-col max-w-[100%]">
                        <h1 className="text-lg whitespace-nowrap text-ellipsis overflow-hidden">{e.username}</h1>
                        <h1 className="text-lg whitespace-nowrap text-ellipsis overflow-hidden">{e.email}</h1>
                      </div>
                      <input id="default-checkbox" type="radio" name='seconduser' className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" value={false} onClick={()=>{
                        setSecondUser(e);
                      }}></input>
                    </div>
                  </div>
                )

              })
            }
            <button className="bg-green-500 text-white px-2 py-2 " onClick={handleRemoveUser}>Remove Member</button>
          </div>
    )
}

export default RemoveUser