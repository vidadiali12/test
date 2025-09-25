import { useEffect } from "react";
import { colorClass, users } from "../../Data"

const Users = ({ userId, messageData, setMessageData, messagesDate, setMessagesDate, setAllMessages,
    allUsers, setAllUsers, setReceiver, unReads, setInputDisplay, selectBg, setSelectBg, textColor, countUnReads,
    lastMessages }) => {

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

        let bg = users.map(() => '');
        bg[elementId] = 'bg-olive-300';
        setSelectBg(bg);

        unReads(updatedMessageData);

        setInputDisplay('flex');
    };

    return (
        <div className="flex flex-col gap-3">
            {allUsers?.map((user, index) => {
                if (user?.userId !== userId) {
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
                            <div className='flex flex-col gap-[0px]'>
                                <span className={`${countUnReads.find(e => e.idOfUser === user?.userId)?.unRead > 0 ? 'font-bold' : 'font-normal'} pl-[8px] text-olive-50`}>
                                    {user?.name} {user?.surname}
                                </span>
                                <span className='w-[200px] text-olive-200 text-[11px] italic pl-[8px] overflow-hidden whitespace-nowrap text-ellipsis'>
                                    {
                                        lastMessages[user?.userId]?.message || ''
                                    }
                                </span>
                            </div>
                            {
                                countUnReads.find(e => e.idOfUser === user?.userId)?.unRead > 0 ? (
                                    <span className='font-bold text-white p-1 bg-olive-500 rounded-3xl w-[27px] h-[27px] flex items-center justify-center text-[15px] ml-auto'>
                                        {countUnReads.find(e => e.idOfUser === user?.userId).unRead > 5 ? '+5'
                                            : `${countUnReads.find(e => e.idOfUser === user?.userId).unRead}`}
                                    </span>
                                ) : null
                            }
                        </div>
                    );
                }
            })}
        </div>
    )
}

export default Users