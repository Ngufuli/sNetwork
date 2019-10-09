const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const router = express.Router();

//load input validations
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//load user models
const User = require("../../models/User");

//@route GET api/users/test
//@desc  Test users route
//@access Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users works"
  })
);

//@route POST api/users/register
//@desc  register user
//@access Public

router.post("/register", (req, res) => {
  //validation
  const { errors, isValid } = validateRegisterInput(req.body);
  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating (Parental Guided)
        d: "mm" //Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//R@oute        GET api/users/login
//@Description  Login/ Returning JWT Token
//@access       Public
router.post("/login", (req, res) => {
  //validation
  const { errors, isValid } = validateLoginInput(req.body);
  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Finding the user by email
  User.findOne({ email }).then(user => {
    errors.email = "Email not found";
    if (!user) {
      return res.status(404).json(errors);
    }
    //Checking the password------/remember the bcrypt encryption
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User matched
        const payload = { id: user.id, name: user.namae, avatar: user.avatar };

        //Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect!";
        return res.status(400).json(errors);
      }
    });
  });
});

//@route GET api/users/current
//@desc  Return current user
//@access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
