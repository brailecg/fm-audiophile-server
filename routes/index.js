var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.json({ log: "hello from expressjs!" });
});

module.exports = router;
