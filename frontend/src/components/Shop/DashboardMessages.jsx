import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { sellerState } from '../../recoil/atoms/seller';
import { useRecoilValue } from 'recoil';
import { server } from '../../server';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineSend } from 'react-icons/ai';
import styles from '../../styles/styles';
import { GrGallery } from "react-icons/gr";

const DashboardMessages = () => {
    const shop = useRecoilValue(sellerState);
    const [conversations, setConversations] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        axios
            .get(`${server}/conversation/get-all-conversation-seller/${shop._id}`, { withCredentials: true })
            .then((res) => setConversations(res.data.conversations))
            .catch((err) => console.log(err));
    }, [shop]);

    return (
        <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
            {
                !open && (
                    <>
                        <h1 className="text-center text-[30px] py-3 font-Poppins">All Messages</h1>
                        {conversations.length > 0 ? (
                            conversations.map((item, index) => (
                                <MessageList
                                    data={item}
                                    key={index}
                                    index={index}
                                    activeIndex={activeIndex}
                                    setActiveIndex={setActiveIndex}
                                    setOpen={setOpen}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No messages found.</p>
                        )}
                    </>
                )
            }
            {
                open && (
                    <ShopInbox setOpen={setOpen} />
                )
            }
        </div>
    );
};

const MessageList = ({ data, index, activeIndex, setActiveIndex, open, setOpen }) => {
    const navigate = useNavigate();
    const handleClick = (id) => {
        navigate(`?${id}`);
        setOpen(true);
    };

    return (
        <div className={`w-full flex p-3 px-3 
        ${activeIndex === index ? "bg-[#00000010]" : "bg-transparent"}
         cursor-pointer`} onClick={() => {
                setActiveIndex(index);
                handleClick(data._id)
            }}>
            <div className="relative">
                <img src="http://localhost:8000/default-1737525154346-480755419.png" alt="" className='w-[50px] h-[50px] rounded-full' />
                <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
            </div>
            <div className="pl-3">
                <h1 className="text-[18px]">Name</h1>
                <p className="text-[16px] text-[#000c]">You: Are you the champion!!....</p>

            </div>
        </div>
    )
}

const ShopInbox = ({ setOpen }) => {
    return (
        <div className="w-full min-h-full flex flex-col justify-between">
            {/* message header */}
            <div className="w-full flex p-3 items-center justify-between bg-slate-200">
                <div className="flex">
                    <img src="http://localhost:8000/default-1737525154346-480755419.png"
                        alt=""
                        className='w-[60px] h-[60px] rounded-full'
                    />
                    <div className='pl-3'>
                        <h1 className='text-[18px] font-[600]'>Champion</h1>
                        <h1>Active now</h1>
                    </div>
                </div>
                <AiOutlineArrowRight
                    size={20}
                    onClick={() => setOpen(false)}
                    className='cursor-pointer' />
            </div>
            {/* messages */}
            <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
                <div className="flex w-full my-2">
                    
                        <img src="http://localhost:8000/default-1737525154346-480755419.png"
                            alt=""
                            className='w-[40px] h-[40px] rounded-full mr-3'
                        />
                        <div className="w-max p-2 rounded bg-[#9210ac93] font-extrabold-900 text-[#ffffff] h-min">
                        <p>Hello champion!!</p>
                    </div>
                </div>
                <div className="flex w-full justify-end my-2">
                    
                        {/* <img src="http://localhost:8000/default-1737525154346-480755419.png"
                            alt=""
                            className='w-[40px] h-[40px] rounded-full mr-3'
                        /> */}
                        <div className="w-max p-2 rounded bg-[#9210ac93] font-extrabold-900 text-[#ffffff] h-min">
                        <p>Hello champion!!</p>
                    </div>
                </div>
            </div>
            {/* send message input */}
            <form aria-required={true} className='p-3 relative w-full flex justify-between items-center'>
                <div className="w-[3%]">
                    <GrGallery size={20} className='cursor-pointer' />
                </div>
                <div className='w-[95%] 800px:w-[97%]'>
                    <input type="text" required placeholder='Enter your message...' className={`${styles.input}`} />
                    <input type="submit" value='Send' className='hidden' id='send' />
                    <label htmlFor="send">
                        <AiOutlineSend size={20} className='absolute right-4 top-5 cursor-pointer' />
                    </label>
                </div>
            </form>

        </div>
    )
}

export default DashboardMessages;