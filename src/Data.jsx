import axios from "axios";

let idsOfMessageSending = []
export const mainMessageDataFetch = async () => {
  try {
    const res = await axios.get("https://chat-backend-9kwg.onrender.com/messages");
    const groupsId = []
    res.data.forEach((message) => {
      groupsId.push(...message.groupId)
    });

    groupsId.forEach((id) => {
      if (!idsOfMessageSending.includes(id)) idsOfMessageSending.push(id)
    });

    return res.data;
  }
  catch (err) {
    return [];
  }
};

let usersData = []
export const totalUsersFetch = async () => {
  try {
    const res = await axios.get("https://chat-backend-9kwg.onrender.com/users");
    res.data.filter((user) => idsOfMessageSending.includes(user.userId));

    return res.data;
  } catch (err) {
    return [];
  }
};


export const users = usersData

export const colorClass = {
  50: "text-custom-50",
  100: "text-custom-100",
  200: "text-custom-200",
  300: "text-custom-300",
  400: "text-custom-400",
  500: "text-custom-500",
  600: "text-custom-600",
  700: "text-custom-700",
  800: "text-custom-800",
  900: "text-custom-900",
}

export const months = {
  '01': 'Yanvar',
  '02': 'Fevral',
  '03': 'Mart',
  '04': 'Aprel',
  '05': 'May',
  '06': 'İyun',
  '07': 'İyul',
  '08': 'Avqust',
  '09': 'Sentyabr',
  '10': 'Oktyabr',
  '11': 'Noyabr',
  '12': 'Dekabr',
}