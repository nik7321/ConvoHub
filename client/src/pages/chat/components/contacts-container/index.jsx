import { useEffect } from "react";
import NewDm from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-clients";
import { GET_DM_CONTACTS_ROUTES } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";

const ContactsContainer = () => {

    const {setDirectMessagesContacts,directMessagesContacts} = useAppStore();

    useEffect(() => {
        const getContacts = async () => {
            const response = await apiClient.get(GET_DM_CONTACTS_ROUTES,
                {withCredentials:true});
            if(response.data.contacts){
                setDirectMessagesContacts(response.data.contacts);
            }    
        };
        getContacts();
    },[]);

    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
            <div className="pt-3 ">
                <Logo/>
            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Previous chats"/>
                    <NewDm/>
                </div>
            
            <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
                <ContactList contacts={directMessagesContacts}/>
            </div>

            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Channels"/>
                </div>
            </div>
            <ProfileInfo/>
        </div>
    );
}

export default ContactsContainer;

const Logo = () => {
    return (
      <div className="flex p-5  justify-start items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 6.827 6.827">
      <g>
      <path d="M0.962 2.983a2.14 2.14 0 0 1 0.544-1.122c0.434-0.397 1.1-0.667 1.906-0.667 0.54 0 1.05 0.135 1.465 0.36 0.295 0.162 0.541 0.369 0.714 0.606 0.114 0.16 0.193 0.344 0.273 0.826H0.962z" fill="#9575cd"/>
      <path d="M2.784 5.22c-0.266 0.166-0.55 0.312-0.853 0.406l-0.21 0.065 0.07-0.17c0.076-0.189 0.141-0.396 0.183-0.604 0.034-0.17 0.053-0.34 0.05-0.5-0.527-0.276-0.842-0.625-0.98-0.99a1.259 1.259 0 0 1-0.082-0.44h4.902c-0.006 0.199-0.06 0.404-0.173 0.611-0.189 0.347-0.501 0.619-0.88 0.81-0.391 0.195-0.854 0.303-1.328 0.319a9.435 9.435 0 0 1-0.699 0.493z" fill="#7e57c2"/>
      </g>
        </svg>
      <span className="text-3xl font-semibold ">ConvoHub</span>
      </div>
    );
  };

  const Title = ({text}) => {
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">{text}</h6>
    )
  }
