const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Bringing up the post model
const Post = require("../../models/Post");

//Validation
const validatePostInput = require("../../validation/post");

//@route POST api/posts
//@desc  Create posts
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
