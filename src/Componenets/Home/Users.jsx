import { useEffect, useState } from "react";
import axios from "axios";
import { colorClass } from "../../Data";

const Users = ({
    userId,
    setMessageData,
    setMessagesDate,
    setAllMessages,
    setReceiver,
    setInputDisplay,
    selectBg,
    setSelectBg,
    textColor,
    lastMessages,
    zIndex, 
    setZIndex
}) => {
    const [allUsers, setAllUsers] = useState([]);
    const [messageData, setLocalMessageData] = useState([]);
    const [countUnReads, setCountUnReads] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Messages və Users fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const messagesRes = await axios.get("https://chat-backend-9kwg.onrender.com/messages");
                const allMessages = messagesRes.data;
                setLocalMessageData(allMessages);
                setMessageData(allMessages);

                let idsOfMessageSending = [];
                allMessages.forEach((message) => {
                    idsOfMessageSending.push(...message.groupId);
                });
                idsOfMessageSending = [...new Set(idsOfMessageSending)];

                const usersRes = await axios.get("https://chat-backend-9kwg.onrender.com/users");
                const filteredUsers = usersRes.data.filter((u) =>
                    idsOfMessageSending.includes(u.userId)
                );

                setAllUsers(filteredUsers);
                setSelectBg(new Array(filteredUsers.length).fill(""));

                // 🔹 Oxunmamış mesajları hesabla
                calculateUnReads(allMessages, filteredUsers);

            } catch (err) {
                console.error("❌ Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setMessageData, setSelectBg]);


    const calculateUnReads = (messages, users) => {
    let unReadsArr = [];

    users.forEach(user => {
        let unRead = 0;

        messages.forEach(message => {
            if (
                !message.isRead &&
                message.senderId == user.userId && // həmin user göndərib
                message.groupId.includes(userId)   // mənimlə yazışmadır
            ) {
                unRead++;
            }
        });

        if (unRead > 0) {
            unReadsArr.push({
                idOfUser: user.userId,
                unRead
            });
        }
    });

    setCountUnReads(unReadsArr);
    console.log(unReadsArr)
};



    const chooseWhats = async (id, elementId) => {
        setZIndex(false)
        const updatedMessageData = messageData.map(item => {
            if (
                item.groupId.includes(userId) &&
                item.groupId.includes(id) &&
                item.senderId === id
            ) {
                return { ...item, isRead: true };
            }
            return item;
        });

        setLocalMessageData(updatedMessageData);
        setMessageData(updatedMessageData);

        const messagesToUpdate = messageData.filter(
            item =>
                item.groupId.includes(userId) &&
                item.groupId.includes(id) &&
                item.senderId === id
        );

        if (messagesToUpdate.length > 0) {
            try {
                await Promise.all(
                    messagesToUpdate.map(item =>
                        axios.put(
                            `https://chat-backend-9kwg.onrender.com/messages/${item._id}`,
                            { ...item, isRead: true }
                        )
                    )
                );
            } catch (err) {
                console.error("❌ Update error:", err);
            }
        }

        continueProses(updatedMessageData, id, elementId);
        calculateUnReads(updatedMessageData, allUsers);
    };

    const continueProses = (updatedMessageData, id, elementId) => {
        const usersMessages = updatedMessageData
            .filter(e => e.groupId.includes(userId) && e.groupId.includes(id))
            .sort((a, b) => new Date(a.time) - new Date(b.time));

        setAllMessages(usersMessages);
        setReceiver(id);

        let dates = [], messagesArrByDates = [];
        usersMessages.forEach(e => {
            const dateKey = e.time.split(" ")[0];
            if (!dates.includes(dateKey)) {
                dates.push(dateKey);
                messagesArrByDates.push(e.time);
            }
        });
        setMessagesDate(messagesArrByDates);

        let bg = new Array(allUsers.length).fill("");
        bg[elementId] = "bg-olive-300";
        setSelectBg(bg);

        setInputDisplay("flex");
    };

    if (loading) {
        return <div className="text-center text-olive-200">Yüklənir...</div>;
    }

    return (
        <div className="flex flex-col gap-3">
            {allUsers?.map((user, index) => {
                if (user?.userId !== userId) {
                    const unreadObj = countUnReads.find(e => e.idOfUser === user?.userId);

                    return (
                        <div
                            id={`${index}`}
                            key={user?.userId}
                            className={`bg-olive-800 ${selectBg[index]} text-olive-900 p-3 rounded cursor-pointer hover:bg-olive-400 transition 
                                flex flex-row items-center justify-flex-start gap-1 w-[100%]`}
                            onClick={(e) => chooseWhats(user?.userId, e.currentTarget.id)}
                        >
                            <div
                                className={`w-[35px] h-[35px] bg-olive-100 rounded-lg ${colorClass[textColor[index]]} font-black flex justify-center items-center`}
                            >
                                {user?.name[0]}
                            </div>
                            <div className="flex flex-col gap-[0px]">
                                <span
                                    className={`${unreadObj?.unRead > 0 ? "font-bold" : "font-normal"} pl-[8px] text-olive-50`}
                                >
                                    {user?.name} {user?.surname}
                                </span>
                                <span className="w-[200px] text-olive-200 text-[11px] italic pl-[8px] overflow-hidden whitespace-nowrap text-ellipsis">
                                    {lastMessages[user?.userId]?.message || ""}
                                </span>
                            </div>
                            {unreadObj?.unRead > 0 ? (
                                <span className="font-bold text-white p-1 bg-olive-500 rounded-3xl w-[27px] h-[27px] flex items-center justify-center text-[15px] ml-auto">
                                    {unreadObj.unRead > 5 ? "+5" : `${unreadObj.unRead}`}
                                </span>
                            ) : null}
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default Users;
