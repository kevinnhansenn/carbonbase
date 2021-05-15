const transactions = [
  {
    date: "5/15/2021, 12:37:20 AM",
    id: 1234567890,
    action: "+",
    amount: 100,
  },
  // {
  //   date: "5/14/2021, 12:37:28 AM",
  //   id: 1234567890,
  //   action: "-",
  //   amount: 10,
  // },
  // {
  //   date: "5/13/2021, 12:37:20 AM",
  //   id: 1234567890,
  //   action: "+",
  //   amount: 100,
  // },
  // {
  //   date: "5/12/2021, 12:37:28 AM",
  //   id: 1234567890,
  //   action: "-",
  //   amount: 10,
  // },
  // {
  //   date: "5/11/2021, 12:37:20 AM",
  //   id: 1234567890,
  //   action: "+",
  //   amount: 100,
  // },
  // {
  //   date: "5/9/2021, 12:37:20 AM",
  //   id: 1234567890,
  //   action: "+",
  //   amount: 100,
  // },
  // {
  //   date: "5/9/2021, 12:37:28 AM",
  //   id: 1234567890,
  //   action: "+",
  //   amount: 10,
  // },
];

const addTransaction = ({ id, action, amount }) => {
  const newTransaction = {
    date: new Date().toLocaleString(),
    id,
    action,
    amount,
  };
  transactions.push(newTransaction);

  let now = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString(
    "en-HK"
  );

  if (process.env.NODE_ENV === "development") {
    now = new Date().toLocaleString("en-HK");
  }

  console.log(`\nTime: ${now}`);
  console.log("NEW TRANSACTION:");
  console.log(newTransaction);
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
