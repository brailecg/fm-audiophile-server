var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  console.log({ log: "log from exp" });
  res.json({ log: "hello from expressjs!" });
});

module.exports = router;
