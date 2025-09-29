import { useEffect, useRef, useState } from 'react'
import { users, colorClass, months } from '../../Data'
import { MdDoneAll, MdSend, MdAdminPanelSettings, MdArrowBack } from 'react-icons/md';
import { AiOutlineDelete, AiOutlineInfoCircle } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import './Home.css'
import UsersArea from './UsersArea';
import { useNavigate } from 'react-router-dom';
import Deleted from '../Modals/Deleted';
import axios from 'axios';
import Loading from '../Loading/Loading';

const Home = ({ userId, setAccess }) => {
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [textColor, setTextColor] = useState([])
    const [user, setUser] = useState({})
    const [allUsers, setAllUsers] = useState([])
    const [noUser, setNoUser] = useState(null)
    const [selectBg, setSelectBg] = useState([])
    const [receiver, setReceiver] = useState(null)
    const [allMessages, setAllMessages] = useState([])
    const [messagesDate, setMessagesDate] = useState([])
    const [inputDisplay, setInputDisplay] = useState('hidden')
    const [lastMessages, setLastMessages] = useState({})
    const [isOpen, setIsOpen] = useState(false);
    const [activeDeletedId, setActiveDeletedId] = useState(null);
    const [modalPos, setModalPos] = useState({ top: 0, left: 0 });

    const [mainMessageData, setMainMessageData] = useState([])
    const [totalUsers, setTotalUsers] = useState([])

    const [loading, setLoading] = useState(true)
    const [zIndex, setZIndex] = useState(true)

    // 📌 ilk yüklənmədə həm users, həm də messages gəlməlidir
    useEffect(() => {
        const callData = async () => {
            try {
                const [usersRes, messagesRes] = await Promise.all([
                    axios.get("https://chat-backend-9kwg.onrender.com/users"),
                    axios.get("https://chat-backend-9kwg.onrender.com/messages")
                ]);

                setTotalUsers(usersRes.data);
                setMainMessageData(messagesRes.data);

                setLoading(false);
            } catch (err) {
                console.error("❌ Error fetching data:", err);
            }
        };

        callData();
    }, []);

    // 📌 loading bitdikdən sonra işləyən bütün funksiyalar
    useEffect(() => {
        if (!loading) {
            findUser();
            sortUsers(mainMessageData);
            findLastMessage(mainMessageData);
        }
    }, [loading]);

    const logOut = () => {
        localStorage.removeItem("chatUserAccess1");
        setAccess(false)
    }

    const findMonths = (text) => {
        const [year, month, day] = text.split("-")
        const isTodoy = new Date()
        const answer = isTodoy.getDate() == day ? 'Bu gün' :
            isTodoy.getDate() - 1 == day
                || (day == 31 && ["01", "03", "05", "07", "08", "10", "12"].includes(month))
                || (day == 30 && ["04", "06", "09", "11"].includes(month))
                || (month == "02" && ["28", "29"].includes(day))
                ? 'Dünən' : `${day} ${months[month]}`
        return answer
    }

    const showInform = (element, id) => {
        const rect = element.getBoundingClientRect();

        if (activeDeletedId === id) {
            setActiveDeletedId(null);
        } else {
            setActiveDeletedId(id);
            setModalPos({
                top: rect.top - 10,
                left: rect.left - 161
            });
        }
    };

    const findUser = () => {
        const user = totalUsers.find(e => e.userId === userId);
        setUser(user)
    }

    const sortUsers = (messageData) => {
        let otherIds = [], choosenIds = [];
        messageData.forEach((e) => {
            if (e.groupId.includes(userId)) {
                e.groupId.forEach((f) => {
                    if (f !== userId) {
                        otherIds.push(f)
                    }
                })
            }
        })

        otherIds.reverse().forEach((e) => {
            if (!choosenIds.includes(e)) {
                choosenIds.push(e)
            }
        })

        setAllUsers(choosenIds.map(e => users.find(user => user.userId === e)))

        let bg = [];
        users.forEach(() => bg.push(''));
        bg[0] = 'bg-olive-300';
        setSelectBg([...bg]);
    }

    const sendData = async (f) => {
        f.preventDefault();

        const thisMessage = document.getElementById('message');
        if (thisMessage.value.trim() !== '') {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            const time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            const newMessage = {
                id: mainMessageData.length,
                senderId: userId,
                groupId: [userId, receiver],
                message: thisMessage.value,
                time: time,
                isRead: false,
                isDeleted: false
            };

            try {
                await axios.post("https://chat-backend-9kwg.onrender.com/messages", newMessage);

                try {
                    const res = (await axios.get("https://chat-backend-9kwg.onrender.com/messages")).data
                    const updatedMessageData = [...res, newMessage];
                    setMainMessageData(updatedMessageData);

                    const updatedMessages = updatedMessageData
                        .filter(e => e.groupId.includes(userId) && e.groupId.includes(receiver))
                        .sort((a, b) => new Date(a.time) - new Date(b.time));

                    setAllMessages(updatedMessages);

                    thisMessage.value = '';

                    sortUsers(updatedMessageData);
                    findLastMessage(updatedMessageData)
                    setIsOpen(false)
                }
                catch (err) {
                    console.error("Error:", err.response?.data);
                }
            } catch (err) {
                console.error("Error:", err.response?.data || err.newMessage);
            }
        }
    };

    const findLastMessage = (messageData) => {
        const lastMessagesByGroup = {};
        messageData.forEach(message => {
            if (message.groupId.includes(userId)) {
                const otherUsers = message.groupId.filter(id => id !== userId);

                otherUsers.forEach(otherId => {
                    if (!lastMessagesByGroup[otherId] || new Date(message.time) > new Date(lastMessagesByGroup[otherId].time)) {
                        lastMessagesByGroup[otherId] = message;
                    }
                });
            }
        });

        setLastMessages(lastMessagesByGroup)
    }

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [allMessages]);

    return (
        <>
            {
                loading ? <Loading /> :
                    <section className="min-h-screen bg-olive-900 flex flex-col items-center justify-center md:p-4 gap-0 p-1 h-[90vh] md:h-auto">
                        <div className="md:p-4 md:py-4 bg-olive-700 md:w-[60%] w-[100%] flex items-center gap-3 shadow-lg p-1 py-3"
                        >
                            <div className={`w-[45px] h-[45px] bg-olive-200 rounded-3xl text-xl
                    ${colorClass[textColor[Math.floor(Math.random() * textColor.length)]]} font-black
                    flex justify-center items-center `}>{user?.name?.[0]}</div>
                            <h1 className='text-olive-100'>
                                {user?.name} {user?.surname}
                            </h1>
                            <div className="ml-auto flex items-center gap-2">
                                {totalUsers.find((user) => user.userId === userId)?.isAdmin && (
                                    <button
                                        onClick={() => navigate("/test/page")}
                                        className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <MdAdminPanelSettings size={18} />
                                        <span>Admin</span>
                                    </button>
                                )}

                                <button
                                    onClick={logOut}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition duration-200 shadow-sm hover:shadow-md"
                                >
                                    <FiLogOut size={18} />
                                    <span>Çıxış</span>
                                </button>
                            </div>
                        </div>
                        <div className="bg-olive-500 flex md:w-[60%] md:h-[80vh] shadow-lg overflow-hidden w-[100%] h-[100vh]">

                            {/* Users */}
                            <UsersArea userId={userId} messageData={mainMessageData} setMessageData={setMainMessageData}
                                messagesDate={messagesDate} setMessagesDate={setMessagesDate}
                                setAllMessages={setAllMessages} allUsers={allUsers} setAllUsers={setAllUsers}
                                setReceiver={setReceiver} setInputDisplay={setInputDisplay}
                                selectBg={selectBg} setSelectBg={setSelectBg} textColor={textColor} setTextColor={setTextColor}
                                lastMessages={lastMessages} noUser={noUser}
                                setNoUser={setNoUser} isOpen={isOpen} setIsOpen={setIsOpen} zIndex={zIndex} setZIndex={setZIndex} />

                            {/* Messages */}
                            <div className="md:w-[70%] bg-olive-500 p-2 overflow-hidden flex flex-col max-h-[100vh] rounded-lg shadow-md relative w-[100%]">
                                <div className='flex justify-between items-center md:py-0 py-2'>
                                    <h2 className="text-2xl font-semibold text-olive-100 pb-2 pl-3 flex items-center">
                                        {
                                            !receiver
                                                ? 'Mesajlar'
                                                : `${totalUsers.find((user) => user.userId === receiver).name} 
                                                    ${totalUsers.find((user) => user.userId === receiver).surname}`
                                        }
                                    </h2>

                                    {/* Geri butonu yalnız mobil üçün */}
                                    <button
                                        onClick={() => setZIndex(true)}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-full 
                                            bg-gradient-to-r from-olive-100 to-olive-200 
                                            text-olive-700 font-medium shadow hover:shadow-lg 
                                            hover:scale-105 active:scale-95 
                                            transition-all duration-200 ease-in-out 
                                            md:hidden mr-2"
                                    >
                                        <MdArrowBack size={18} />
                                        <span>Geri</span>
                                    </button>
                                </div>


                                {receiver === null ? <div className="flex-1 overflow-y-auto bg-olive-600 rounded-md p-4 shadow-inner mb-4 max-h-[95vh] pl-4">
                                    <div className="text-olive-700 italic text-white">Söhbət seç</div>
                                </div>
                                    :
                                    <div className='overflow-auto max-h-[calc(100%-110px)] flex flex-col gap-1 p-4 rounded-md shadow-inner bg-olive-600'>
                                        {
                                            allMessages.length === 0 ? <div className='text-white'>
                                                Söhbətə başla
                                            </div> :
                                                <>
                                                    {
                                                        allMessages.map((message) => {
                                                            return <>
                                                                {
                                                                    messagesDate.includes(message.time) ? <span
                                                                        className='py-1 my-2 mx-[auto] w-[90px] rounded-md bg-white border text-center text-[13px]'>
                                                                        {
                                                                            findMonths(message.time.split(' ')[0].slice(0, 10))
                                                                        }
                                                                    </span> : null
                                                                }
                                                                {
                                                                    message.senderId === userId && message.isDeleted ? null :
                                                                        <div key={`${message.id}`} className={` flex flex-col gap-1
                                                        ${message.senderId === userId ? 'self-end' : 'self-start'}`}>
                                                                            <div className='flex gap-1 items-center'>
                                                                                {
                                                                                    message.senderId === userId ? (
                                                                                        message.isDeleted ? null :
                                                                                            <><div
                                                                                                className="flex items-center justify-center w-[17px] h-[17px] rounded-full bg-white shadow cursor-pointer"
                                                                                                onClick={(e) => showInform(e.currentTarget, message.id)}
                                                                                                style={{ display: 'none' }}
                                                                                            >
                                                                                                <AiOutlineInfoCircle className="text-gray-500" size={16} />
                                                                                                {activeDeletedId === message.id && (
                                                                                                    <Deleted
                                                                                                        className="fixed bg-white shadow-lg border"
                                                                                                        style={{ top: modalPos.top, left: modalPos.left }}
                                                                                                        messageId={message.id}
                                                                                                        setAllMessages={setAllMessages}
                                                                                                    />
                                                                                                )}
                                                                                            </div>
                                                                                            </>
                                                                                    ) : null
                                                                                }
                                                                                <span className={`${message.senderId === userId ? 'self' : ''} message-bubble ${message.isDeleted ? 'is-deleted' : ''}`}>
                                                                                    {
                                                                                        message.isDeleted ?
                                                                                            message.senderId === userId ? "Bu mesajı sildiniz" : "Bu mesaj silinib"
                                                                                            : message.message
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <span className='text-customGray-50 italic text-[10px] text-right flex self-end pr-1 relative bottom-1
                                                            flex gap-1 items-center'>
                                                                                {
                                                                                    message.time.split(' ')[1].slice(0, 5)
                                                                                }
                                                                                {
                                                                                    message.senderId === userId ?
                                                                                        <MdDoneAll color={message.isRead ? "#32aedfff" : "darkgray"} size={14} />
                                                                                        : null
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                }
                                                            </>
                                                        })
                                                    }
                                                    < div ref={messagesEndRef} />
                                                </>
                                        }
                                    </div>
                                }


                                <form onSubmit={sendData} className={`h-[5vh] min-h-[50px] w-[calc(100%-16px)] ${inputDisplay} items-center gap-2 bg-olive-100 rounded-md p-2 shadow-inner absolute bottom-2 left-2`}>
                                    <input
                                        id='message'
                                        type="text"
                                        placeholder="Mesaj yazın..."
                                        className="flex-1 px-3 py-2 rounded-md border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-400"
                                    />

                                    <button type='submit'
                                        className="bg-olive-400 hover:bg-olive-500 text-white px-4 py-2 rounded-md transition flex items-center gap-2"
                                        aria-label="Göndər"
                                    >
                                        <MdSend className="w-5 h-5" />
                                    </button>

                                </form>
                            </div>
                        </div>
                    </section>
            }
        </>
    )
}

export default Home