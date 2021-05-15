const users = [
  {
    id: 1234567890,
    name: "Kevin Hansen",
    email: "kevinhansen36@yahoo.com",
    password: "123456",
    points: 1200,
    socketId: null,
  },
];

const checkUserExist = ({ email, password }) => {
  let found = null;
  users.forEach((user) => {
    if (user.email === email.toLowerCase() && user.password === password) {
      found = { ...user };
    }
  });
  return found;
};

const addUser = ({ name, email, password }) => {
  const newUser = {
    id: new Date().getTime(),
    name,
    email,
    password,
    points: 300,
    socketId: null,
  };
  users.push(newUser);

  let now = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString(
    "en-HK"
  );

  if (process.env.NODE_ENV === "development") {
    now = new Date().toLocaleString("en-HK");
  }

  console.log(`\nTime: ${now}`);
  console.log("NEW USER:");
  console.log(newUser);

  return newUser;
};

const checkNameExist = ({ name }) => {
  let found = false;
  users.forEach((user) => {
    if (user.name === name) {
      found = true;
    }
  });
  return found;
};

const registerSocketId = ({ userId, socketId }) => {
  let found = false;
  users.forEach((user) => {
    if (user.id === userId) {
      user.socketId = socketId;
      found = true;
    }
  });

  return found;
};

const removeSocketId = (socketId) => {
  users.forEach((user) => {
    if (user.socketId === socketId) {
      user.socketId = null;
    }
  });
};

const getSocketIdByUserId = (userId) => {
  let found;
  users.forEach((user) => {
    if (user.id === userId) {
      found = user.socketId;
    }
  });
  return found;
};

const getUserById = (userId) => {
  let found;
  users.forEach((user) => {
    if (user.id === userId) {
      found = user;
    }
  });
  return found;
};

const updatePoints = ({ id, action, amount }) => {
  users.forEach((user) => {
    if (user.id === id) {
      if (action === "+") {
        user.points = user.points + amount;
      }
      if (action === "-") {
        user.points = user.points - amount;
      }
    }
  });
};

const getAllUsers = () => {
  return [...users];
};

module.exports = {
  updatePoints,
  getUserById,
  getSocketIdByUserId,
  removeSocketId,
  registerSocketId,
  checkUserExist,
  getAllUsers,
  checkNameExist,
  addUser,
};
