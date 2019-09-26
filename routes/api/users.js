const express = require("express");
const router = express.Router();

//@route GET api/users/test
//@desc  Test users route
//@access
router.get("/tests", (req, res) =>
  res.json({
    msg: "Users works"
  })
);

module.exports = router;
