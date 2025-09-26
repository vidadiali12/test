import TotalUsers from './TotalUsers';
import Users from './Users';
import { mainMessageDataFetch, totalUsersFetch, users } from '../../Data';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useEffect, useState } from 'react';

const UsersArea = ({ userId, messageData, setMessageData, messagesDate, setMessagesDate, setAllMessages,
    allUsers, setAllUsers, setReceiver, setInputDisplay, selectBg, setSelectBg, textColor, setTextColor,
    lastMessages, noUser, setNoUser, isOpen, setIsOpen, zIndex, setZIndex }) => {

    const [totalUsersArr, setTotalUsersArr] = useState([])
    const [totalUsers, setTotalUsers] = useState([])
    const [mainMessageData, setMainMessageData] = useState([])

    const toggle = () => setIsOpen(!isOpen);

    const createColors = () => {
        let colors = [], bg = []
        users.forEach((e, i) => {
            if (i < 10) {
                colors.push(i * 100)
            }
            else {
                colors.push(Number(i.toString()[1]) * 100)
            }

            bg.push('')
        })
        setTextColor([...colors])
        setAllUsers([...users])
        setSelectBg([...bg])
    }

    const searchUser = (inputValue) => {
        const groupsId = []
        mainMessageData().forEach((message) => {
            if (message.groupId.includes(userId)) groupsId.push(...message.groupId)
        })

        const searchUsers = isOpen ? totalUsers : users.filter((user) => groupsId.includes(user.userId))

        if (!inputValue) {
            setAllUsers(users.filter((user) => groupsId.includes(user.userId)));
            setTotalUsersArr(totalUsers)
            setNoUser(false);
            return;
        }

        const searchingUsers = searchUsers.filter(user => {
            const query = inputValue.trim().toUpperCase();
            return (
                user.name.trim().toUpperCase().includes(query) ||
                user.surname.trim().toUpperCase().includes(query) ||
                (user.name.trim().toUpperCase().concat(" ", user.surname.trim().toUpperCase())).includes(query)
            );
        });

        isOpen ? setAllUsers(users.filter((user) => groupsId.includes(user.userId))) : setAllUsers(searchingUsers);
        setTotalUsersArr(searchingUsers)
        setNoUser(searchingUsers.length === 0);
    }

    const callData = async () => {
        const fetchedUsers = await totalUsersFetch();
        const fetchedMessages = await mainMessageDataFetch();

        setTotalUsers(fetchedUsers);
        setMainMessageData(fetchedMessages);
    }

    useEffect(() => {
        (async () => {
            await callData();
            createColors();
        })();
    }, [])

    return (

        <div className={`md:w-[30%] bg-olive-700 p-4 overflow-y-auto border-r border-olive-300 w-[calc(100%-8px)] absolute md:static h-[calc(100%-9vh)] md:h-[auto] ${zIndex ? 'element-z-i' : ''}`}>
            <input
                type="search"
                placeholder="axtar..."
                className="w-full mb-4 p-2 rounded-md border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-400 transition bg-olive-400 text-white"
                onChange={(e) => searchUser(e.target.value)}
                style={{ display: 'none' }}
            />
            <h2 className="text-2xl font-semibold mb-4 text-olive-100">İstifadəçilər</h2>
            {
                noUser ? <span className="text-red-600 font-semibold italic text-sm">
                    {
                        !isOpen ? "Heç bir mesajlaşma Tapılmadı" : "Bazada belə bir istifadəçi yoxdur"
                    }
                </span> : null
            }
            {
                !isOpen ?
                    <Users
                        userId={userId}
                        setMessageData={setMessageData}
                        setMessagesDate={setMessagesDate}
                        setAllMessages={setAllMessages}
                        setReceiver={setReceiver}
                        setInputDisplay={setInputDisplay}
                        selectBg={selectBg}
                        setSelectBg={setSelectBg}
                        textColor={textColor}
                        lastMessages={lastMessages}
                        zIndex={zIndex} setZIndex={setZIndex}
                    />

                    : <TotalUsers userId={userId} messageData={messageData} setMessageData={setMessageData}
                        messagesDate={messagesDate} setMessagesDate={setMessagesDate}
                        setAllMessages={setAllMessages} setReceiver={setReceiver}
                        setInputDisplay={setInputDisplay} totalUsersArr={totalUsersArr} setTotalUsersArr={setTotalUsersArr}
                        zIndex={zIndex} setZIndex={setZIndex} />
            }
            {
                totalUsers.find(e => e.userId === userId)?.isAdmin ? <div className='fixed md:left-[calc(38%-60px)] left-[calc(100%-75px)] bottom-[7vh] w-[50px] h-[50px] bg-white rounded-full flex justify-center items-center text-olive-600 cursor-pointer'
                    onClick={toggle}>
                    {isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
                </div> : null
            }
        </div>
    )
}

export default UsersArea