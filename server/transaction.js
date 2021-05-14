const transactions = [
  {
    date: "15/5/2021, 12:37:20 am",
    id: 1234567890,
    action: "+",
    amount: 100,
  },
  {
    date: "14/5/2021, 12:37:28 am",
    id: 1234567890,
    action: "-",
    amount: 10,
  },
  {
    date: "13/5/2021, 12:37:20 am",
    id: 1234567890,
    action: "+",
    amount: 100,
  },
  {
    date: "12/5/2021, 12:37:28 am",
    id: 1234567890,
    action: "-",
    amount: 10,
  },
  {
    date: "11/5/2021, 12:37:20 am",
    id: 1234567890,
    action: "+",
    amount: 100,
  },
  {
    date: "10/5/2021, 12:37:28 am",
    id: 1234567890,
    action: "-",
    amount: 10,
  },
  {
    date: "9/5/2021, 12:37:20 am",
    id: 1234567890,
    action: "+",
    amount: 100,
  },
  {
    date: "8/5/2021, 12:37:28 am",
    id: 1234567890,
    action: "-",
    amount: 10,
  },
];

const addTransaction = ({ id, action, amount }) => {
  transactions.push({
    date: new Date().toLocaleString("en-HK"),
    id,
    action,
    amount,
  });
};

const getHistoryById = (id) => {
  return transactions.filter((t) => t.id === id);
};

const getAllHistory = () => {
  return [...transactions];
};

module.exports = {
  addTransaction,
  getHistoryById,
  getAllHistory,
};
