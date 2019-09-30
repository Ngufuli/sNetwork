const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

//Load Profile model
const Profile = require("../../models/Profile");

//Load User model
const User = require("../../models/User");

//@route GET api/profile/test
//@desc  Test profile route
//@access
router.get("/test", (req, res) =>
  res.json({
    msg: "Profile works"
  })
);

//@route POST api/profile/
//@desc  Create user profile
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileFields = {};
  }
);

module.exports = router;
