const express = require("express");
const path = require("path");
const {
  addUser,
  checkNameExist,
  getAllUsers,
  checkUserExist,
} = require("./users");
const { getAllHistory, getHistoryById } = require("./transaction");
const {
  frame,
    dayMap
} = require("./utils");
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

  const lastWeek = new Date(now.getTime() - (6 * 24 * 60 * 60 * 1000));

  console.log(lastWeek.toLocaleString())

  const d = lastWeek.getDate()
  const m = lastWeek.getMonth()
  const y = lastWeek.getFullYear()

  const starting = new Date(d, m, y)

  const day = now.getDay()

  const _frame = frame.slice()
  const reFrame = _frame.slice(day).concat(_frame.slice(0, day))

  const _reFrame = JSON.parse(JSON.stringify(reFrame))

  reFrame.forEach(r => r.type = 'Lon')
  _reFrame.forEach(r => r.type = 'Bor')

  transactions.forEach(trx => {
    const parsed = new Date (Date.parse(trx.date))

    if (parsed.getTime() >= starting.getTime()) {
      console.log(parsed.toLocaleString())
      const _day = dayMap[parsed.getDay()]

      if (trx.action === '+') {
        reFrame.forEach(r => {
          if (r.day === _day)  r.total = r.total + 1
        })
      }

      if (trx.action === '-') {
        _reFrame.forEach(r => {
          if (r.day === _day)  r.total = r.total + 1
        })
      }
    }
  })

  const finalFrame = reFrame.concat(_reFrame)

  res.status(200).send(finalFrame);
});

module.exports = router;
