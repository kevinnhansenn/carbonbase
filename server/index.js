const app = require("express")();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const Router = require("./router");
const { getAllUsers } = require("./users");
const { updatePoints } = require("./users");
const { getUserById } = require("./users");
const { getSocketIdByUserId } = require("./users");
const { addTransaction } = require("./transaction");
const { removeSocketId } = require("./users");
const { registerSocketId } = require("./users");
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
  const cors = require("cors");
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
}

app.use(bodyParser.json());
app.use(Router);

let option = {};

if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
  option = {
    cors: {
      origin: "http://localhost:3000",
    },
  };
}

const io = require("socket.io")(http, option);

io.on("connection", (socket) => {
  const id = socket.id;

  socket.on("JOIN", (userId, cb) => {
    const result = registerSocketId({ userId, socketId: socket.id });
    const user = getUserById(userId);

    if (cb && result && user) cb(user);
  });

  socket.on("ADMIN_JOIN", (cb) => {
    cb();
  });

  socket.on("EXECUTE", ({ id, action, amount }, cb) => {
    addTransaction({ id, action, amount });
    updatePoints({ id, action, amount });

    const socketId = getSocketIdByUserId(id);

    if (socketId) {
      socket.broadcast.to(socketId).emit("TRANSACTION", {
        amount,
        action,
      });
      cb();
    }
  });

  socket.on("JUST_REGISTER", () => {
    io.emit("SOMEONE_JUST_REGISTER", getAllUsers().length);
  });

  socket.on("disconnect", () => {
    removeSocketId(id);
  });
});

http.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
