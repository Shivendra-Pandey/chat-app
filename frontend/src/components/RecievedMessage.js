import { UserContext } from "../context/userContext";
import { useContext } from "react";
function RecievedMessage({message , sender}){
   
    const {user} = useContext(UserContext);

    return(
        <div className=" mr-auto got inline-block max-w-[50%]  break-words my-1 px-2 py-2 bg-white min-h-[8%]">
            <p>{sender.username}</p>
            <p>{message}</p>
        </div>
    )
}

export default RecievedMessage