const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.json({ log: "hello from expressjs!" });
});

module.exports = router;
