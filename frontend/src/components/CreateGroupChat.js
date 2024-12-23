import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";



function CreateGroupChat(){

    const { user , selectedChat, setSelectedChat, setGroupChatButton} = useContext(UserContext);


    const [groupChatName,setGroupChatName] = useState("");
    const [groupChatSearch , setGroupChatSearch] = useState("");
    const [userList,setUserList] = useState([]);
    const [groupChatUsers,setGroupChatUsers] = useState([user._id]);
    
    const getUsers = async () =>{
        const response = await fetch(`http://localhost:5000/api/user/allusers/?username=${groupChatSearch}`)
        const data = await response.json();
        setUserList(data.users);
        console.log(userList)   
    }
    
    const handleCreateGroup = async () =>{
        const response = await fetch("http://localhost:5000/api/chat/createGroup",{
            method : "POST",
            body : JSON.stringify({chatName : groupChatName , users : groupChatUsers}),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        const data = await response.json();
        console.log(data)
        setGroupChatName("");
        setGroupChatSearch("");
        setGroupChatUsers([user._id]);
        setSelectedChat(data.groupchat._id);
        setGroupChatButton(false);
    }

    console.log(groupChatUsers)

    useEffect(()=>{
        getUsers()
    },[groupChatSearch])

    return(
          <div className="flex flex-col items-center w-[50%] h-full mx-auto my-auto justify-center px-2  overflow-scroll">
            <div className="w-[100%] min-h-[7%] rounded-lg ">
              <label className="text-lg">Group Chat Name</label>
              <input placeholder="Group Chat Name " className="h-full w-full px-2 focus:outline-none" value={groupChatName} onChange={(e)=>{setGroupChatName(e.target.value)}} ></input>
            </div>
            <div className="w-[100%] min-h-[5%] bg-white my-1 rounded-lg ">
              <input placeholder="Search Users" className="h-full w-full px-2 focus:outline-none" value={groupChatSearch} onChange={(e)=>{setGroupChatSearch(e.target.value)}} ></input>
            </div>
            {
              userList.length &&  userList.filter((e)=>e._id!=user._id).map((user)=>{
                return(
                  <div className="flex w-[100%] my-1 rounded-md min-h-[5%] bg-white shadow-lg cursor-pointer px-2 justify-between items-center">
                    <div className="flex w-[100%] justify-between items-center">
                      <div className="flex flex-col max-w-[100%]">
                        <h1 className="text-lg whitespace-nowrap text-ellipsis overflow-hidden">{user.username}</h1>
                        <h1 className="text-lg whitespace-nowrap text-ellipsis overflow-hidden">{user.email}</h1>
                      </div>
                      <input id="default-checkbox" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" value={false} onClick={()=>{
                        if(groupChatUsers.includes(user._id)){
                          setGroupChatUsers(groupChatUsers.filter((id)=>id!=user._id))
                      }else if(!groupChatUsers.includes(user._id)){
                          setGroupChatUsers([...groupChatUsers,user._id])
                      }}}></input>
                    </div>
                  </div>
                )
              })
            }
            <button className="bg-green-500 text-white px-2 py-2 " onClick={handleCreateGroup}>Create Group Chat</button>
          </div>
    )
}

export default CreateGroupChat;