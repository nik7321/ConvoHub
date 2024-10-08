import { apiClient } from "@/lib/api-clients";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {MdAppBlocking, MdFolderZip} from "react-icons/md";
import {IoMdArrowRoundDown} from 'react-icons/io';
import { IoCloseSharp } from "react-icons/io5"; 


const MessageContainer = () => {
    const {
        selectedChatType,selectedChatData,userInfo,selectedChatMessages,setSelectedChatMessages
    } = useAppStore();  
    const scrollRef = useRef();

    const [showImage,setShowImage] = useState(false);
    const [imageURL,setImageUrl] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            try{
                const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE,
                    {id:selectedChatData._id},
                    {withCredentials:true},
                );
                if(response.data.messages){
                    setSelectedChatMessages(response.data.messages);
                }
            }
            catch(error){
                console.log({error}); 
            }
        };
        if(selectedChatData._id){
            if(selectedChatType==="contact") getMessages();
        }
    },[
        selectedChatData,
        selectedChatType,
        setSelectedChatMessages
    ]);

    useEffect(() => {
        if(scrollRef.current){
            scrollRef.current.scrollIntoView({behavior:"smooth"});
        }
    }, [selectedChatMessages]);

    const checkIfImage = (filePath) => {
        const imageRegex = 
        /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
        return imageRegex.test(filePath);
    }

    const downloadFile = async (url) => {
        const response = await apiClient.get(`${HOST}/${url}`,{responseType:"blob",}); 
        const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href=urlBlob;
        link.setAttribute("download",url.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob); 
    }
    
    const renderMessages = () =>{
        let lastDate =null;
        return selectedChatMessages.map((message,index) => {
            const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
            const showDate=message !==lastDate;
            lastDate=messageDate;
            return (
                <div key={index}>
                    {
                        showDate && (<div className="text-center text-gray-500 my-2">
                            {moment(message.timestamp).format("LL")}
                        </div>
                        )}
                        {
                            selectedChatType==="contact" && renderDMMessages(message)
                        }
                </div>
            )
        });
    };

    const renderDMMessages = (message) => (
        <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
    {
        message.messageType === "text" && (
            <div className={`${message.sender !== selectedChatData._id ? 
                "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"}
                 border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                >
                    {message.content}
            </div>
        )}
        
        {
            message.messageType==="file" &&( <div className={`${message.sender !== selectedChatData._id ? 
                "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"}
                 border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                    {checkIfImage(message.fileUrl) ? 
                    (<div className="cursor-pointer"
                    onClick={()=>{
                        setShowImage(true);
                        setImageUrl(message.fileUrl);
                    }}
                    >
                        <img src={`${HOST}/${message.fileUrl}`} height={300} width={300}/>
                    </div>) : 
                    (
                    <div className="flex items-center justify-center gap-4">
                        <span className="text-white/80 text-3xl bg-black/20  rounded-full">
                        <MdFolderZip/>
                        </span>
                        <span>{message.fileUrl.split('/').pop()}</span>
                        <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                        onClick={() => downloadFile(message.fileUrl)}
                        >
                            <IoMdArrowRoundDown/>
                        </span>
                    </div>
                    )}
            </div>)
        }

    <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
    </div>
    </div>
);

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
            {renderMessages()}
            <div ref={scrollRef}>
            {
                showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center backdrop-blur-lg flex-col">
                    <div>
                        <img src={`${HOST}/${imageURL}`}
                        className="h-[80vh] w-full bg-cover"
                        />
                    </div>
                    <div className="flex gap-5 fixed top-0 mt-5">
                        <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                        onClick={()=>{
                            downloadFile(imageURL)
                        }}
                        >
                        <IoMdArrowRoundDown/>
                        </button>

                        <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                        onClick={()=>{
                            setShowImage(false);
                            setImageUrl(null)
                        }}
                        >
                        <IoCloseSharp/>
                        </button>

                    </div>
                </div>
            }
            </div>
        </div>
    );
}

export default MessageContainer;
