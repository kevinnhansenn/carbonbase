const express = require("express");
const path = require("path");
const {
  addUser,
  checkNameExist,
  getAllUsers,
  checkUserExist,
} = require("./users");
const { getAllHistory, getHistoryById } = require("./transaction");
const router = express.Router();

router.get(/(\/home)|(\/admin)|(\/)$/, (req, res, next) => {
  router.use(express.static(path.join(__dirname, "../client/build/")));

  const staticFile = "index.html";
  const options = {
    root: path.join(__dirname, "../client/build"),
  };

  res.sendFile(staticFile, options, (err) => {
    if (err) {
      console.log(err);
      next(err);
    }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const found = checkUserExist({ email, password });

  if (found) {
    res.status(200).send(found);
  } else {
    res.status(504).send("Invalid Credentials");
  }
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const found = checkNameExist({ name });

  if (!found) {
    const user = addUser({ name, email, password });
    res.status(200).send(user);
  } else {
    res.status(504).send("Name Already Taken");
  }
});

router.post("/getHistory", (req, res) => {
  const { id } = req.body;

  const history = getHistoryById(id);

  res.status(200).send(history);
});

router.get("/getHistory", (req, res) => {
  const history = getAllHistory();
  const users = getAllUsers();
  const results = [];

  history.forEach((h) => {
    const user = users.find((u) => u.id === h.id);
    if (user) {
      results.push({
        name: user.name,
        amount: h.amount,
        action: h.action,
        date: h.date,
      });
    }
  });

  res.status(200).send(results);
});

router.get("/getDashboard", (req, res) => {
  const users = getAllUsers();
  const count = users.length;

  const transactions = getAllHistory();

  const now = new Date(new Date().toLocaleString("en-HK"));

  now.getTime() - (7 * 24 * 60 * 60 * 1000));

  res.status(200).send(results);
});

module.exports = router;
