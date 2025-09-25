import { useEffect } from "react";
import { totalUsers } from "../../Data"

const TotalUsers = ({ userId, messageData, setMessageData, messagesDate, setMessagesDate, setAllMessages,
    setReceiver, unReads, setInputDisplay, totalUsersArr, setTotalUsersArr }) => {

    const chooseWhats = (id, elementId) => {
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

        setMessageData(updatedMessageData);
        localStorage.setItem('messageData1', JSON.stringify(updatedMessageData));

        const usersMessages = updatedMessageData
            .filter(e => e.groupId.includes(userId) && e.groupId.includes(id))
            .sort((a, b) => new Date(a.time) - new Date(b.time));

        setAllMessages(usersMessages);
        setReceiver(id);

        // tarixləri təkrar tap
        let dates = [], messagesArrByDates = [];
        usersMessages.forEach(e => {
            const dateKey = e.time.split(' ')[0];
            if (!dates.includes(dateKey)) {
                dates.push(dateKey);
                messagesArrByDates.push(e.time);
            }
        });
        setMessagesDate(messagesArrByDates);

        // let bg = users.map(() => '');
        // bg[elementId] = 'bg-olive-300';
        // setSelectBg(bg);

        unReads(updatedMessageData);

        setInputDisplay('flex');
    };

    useEffect(() => {
        setTotalUsersArr(totalUsers)
    }, [])


    return (
        <div className="flex flex-col gap-3">
            {
                totalUsersArr?.map((user, index) => {
                    if (user?.userId !== userId) {
                        return (
                            <div
                                id={`${index}`}
                                key={user?.userId}
                                className={`bg-olive-800 text-olive-100 p-3 rounded cursor-pointer hover:bg-olive-400 transition 
                                            flex flex-row items-center justify-flex-start gap-1 w-[100%]`}
                                onClick={(e) => chooseWhats(user?.userId, e.currentTarget.id)}
                            >
                                <div
                                    className={`w-[35px] h-[35px] bg-olive-100 rounded-lg font-black flex justify-center items-center text-olive-600`}
                                >
                                    {user?.name[0]}
                                </div>
                                <div className='flex flex-col gap-[0px]'>
                                    <span className={`pl-[8px]`}>
                                        {user?.name} {user?.surname}
                                    </span>
                                </div>
                            </div>
                        );
                    }
                })
            }
        </div>
    )
}

export default TotalUsers