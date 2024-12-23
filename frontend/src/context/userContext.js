
import { createContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UserContext = createContext();

function Context ({children})  {
    
    const navigate = useNavigate();
    const [user,setUser] = useState({});
    const [chats,setChats] = useState([]);
    const [selectedChat,setSelectedChat] = useState("");
    const [groupChatButton,setGroupChatButton] = useState(false);
    const [newChat,setNewChat] = useState(false);
    const [showMembers,setShowMembers] = useState(false);
    const [addMembers,setAddMembers] = useState(false);
    
    useEffect(()=>{
        if(!localStorage.getItem("user")){
            navigate("/login");
        }else{
            setUser(JSON.parse(localStorage.getItem("user")));
            navigate("/chats");
        }
    },[])

    return (
        <UserContext.Provider value={{ chats , setChats, user, selectedChat, setSelectedChat, groupChatButton, setGroupChatButton, newChat, setNewChat, showMembers, setAddMembers, addMembers, setShowMembers }} >
            {children}
        </UserContext.Provider>
    )
}





export {Context,UserContext} 