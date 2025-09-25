import { mainMessageData } from '../../Data';

const Deleted = ({ className = "", style = {}, messageId, setAllMessages }) => {

    const deleteFromAll = () => {
        const deletedFromAll = mainMessageData.map((message) =>
            message.id === messageId
                ? { ...message, message: '', isDeleted: true }
                : message
        );

        localStorage.setItem('messageData1', JSON.stringify(deletedFromAll));
        setAllMessages(deletedFromAll)
    };



    return (
        <div
            className={`rounded-lg py-1 px-3 border border-gray-200 shadow-xl bg-white w-[min-content] whitespace-nowrap
                  animate-slideDown ${className} text-[14px] pb-[6px]`}
            style={style}
        >
            <div className="flex flex-col items-end">
                <button className="px-2 py-[1px] w-[min-content] whitespace-nowrap text-red-500 
                    hover:bg-red-100 transition text-right">
                    Ancaq özündən Sil
                </button>
                <button onClick={deleteFromAll}
                    className="px-2 py-[1px] w-full whitespace-nowrap text-red-500 
                    hover:bg-red-100 transition text-right"
                >
                    Hər kəsdən sil
                </button>

                <button className="px-2 py-[1px] text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition w-[min-content] whitespace-nowrap mt-[4px]">
                    Ləğv et
                </button>
            </div>
        </div>
    );
};

export default Deleted