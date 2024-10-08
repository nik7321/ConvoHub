import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext,useEffect,useContext,useRef} from "react";
import { io} from "socket.io-client";


const SocketContext = createContext(null);  

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({children}) => {
    const socket = useRef();
    const {userInfo} = useAppStore();

    useEffect(() => {
        if(userInfo){
            socket.current = io(HOST,{
                withCredentials:true,
                query:{userId:userInfo.id},
            });
            socket.current.on("connect",()=>{
                console.log("Connected to socket server");
            });
            

            const handleRecieveMessage = (message) => {
                const  {selectedChatData,selectedChatType,addMessage} = useAppStore.getState();
                if(selectedChatType!==undefined && 
                    (selectedChatData._id === message.sender._id || 
                        selectedChatData._id === message.recipient._id)){
                            console.log("msg rcv",message);
                            addMessage(message);
                }
            };

            socket.current.on("recieveMessage",handleRecieveMessage);

            return () => {
                socket.current.disconnect();
            }
        }
    },[userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
};