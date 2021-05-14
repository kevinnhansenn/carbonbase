const express = require("express");
const { addUser } = require("./users");
const { checkNameExist } = require("./users");
const { getAllUsers } = require("./users");
const { getAllHistory } = require("./transaction");
const { getHistoryById } = require("./transaction");
const router = express.Router();
const { checkUserExist } = require("./users");

router.get("/test", (req, res) => {
  res.status(200).send("OK");
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

module.exports = router;
