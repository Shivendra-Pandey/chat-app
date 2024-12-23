import React , {useContext} from 'react'
import { UserContext } from '../context/userContext'

function MyChat({sender , message , id}){
  const { setSelectedChat } = useContext(UserContext);
    return (

        
        <>
       
          <div className="flex w-[100%] my-1 rounded-md min-h-[12%] bg-white shadow-lg cursor-pointer px-2 justify-between items-center" onClick={()=>{
            setSelectedChat(id);
          }}>
            <div className="flex items-center space-x-2">
              <p className="flex w-10 h-10 rounded-full text-white bg-black items-center justify-center">{sender.charAt(0)!="" ? sender.charAt(0) : "G"}</p>
              <div className="flex flex-col max-w-[60%]">
                <h1 className="text-lg whitespace-nowrap text-ellipsis overflow-hidden">{sender}</h1>
                <p className="text-md  whitespace-nowrap text-ellipsis overflow-hidden">{message}</p>
              </div>
            </div>
            {/* <div className="flex flex-col mx-2 overflow-visible items-center">
             <h1 className="whitespace-nowrap">15 april</h1>
             <p className="text-center w-6 h-6 rounded-full bg-black text-white">2</p>
            </div> */}
          </div>
        </>
    )
}

export default MyChat