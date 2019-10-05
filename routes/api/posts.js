const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Bringing up the post model
const Post = require("../../models/Post");

//Bringing up the profile model
const Profile = require("../../models/Profile");

//Validation
const validatePostInput = require("../../validation/post");

//@route GET api/posts
//@desc  Get posts
//@access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({
        nopostfound: `No post found for user with ${req.params.id} id`
      })
    );
});

//@route GET api/posts/:id
//@desc Get posts by id
//@access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: `No posts found` }));
});

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

//@route DELETE api/posts/:id
//@desc  Delete posts
//@access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check for the owner of the post
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ unauthorized: `User not authorized` });
          }
          //Delete
          post.remove().then(() => res.json({ sucess: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: `No post found` }));
    });
  }
);

//@route POST api/posts/like/:id
//@desc  Like posts
//@access Private
router.post(
  "like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: `User already liked this post` });
          }
          //Add user ID to the likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: `No post found` }));
    });
  }
);
module.exports = router;
