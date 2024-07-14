const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const isEqual = require("../utilities/customValidation");
const User = require("../models/userSchema");
const Message = require("../models/messageSchema");

const signup_get = asyncHandler(async (req, res, next) => {
  res.render("signup_form", {
    title: "Sign Up",
  });
});

const signup_post = [
  body("first_name", "First name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    "username",
    "Email is required and should take the form: user@domain.ext"
  )
    .trim()
    .isEmail()
    .escape(),
  body(
    "password",
    "Passwords must be at least 8 characters long, contain an upper and lower case letter, a special character and a number"
  )
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .escape(),
  body("password_confirm", "Passwords do not match")
    .trim()
    .custom(isEqual)
    .escape(),
  asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      const errors = validationResult(req);
      const admin = req.body._is_admin !== "undefined";
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword,
        is_admin: admin,
        membership_status: admin,
      });
      if (!errors.isEmpty()) {
        res.render("signup_form", {
          title: "Sign Up",
          user,
          errors: errors.array(),
        });
        return;
      }
      const checkUser = await User.findOne({
        username: req.body.username,
      }).exec();
      if (checkUser) {
        res.render("signup_form", {
          title: "Sign Up",
          user,
          errors: [{ msg: "Username taken. Choose another" }],
        });
        return;
      }
      await user.save();
      res.render("user_home", {
        title: "Profile",
        user,
      });
    });
  }),
];

const signin_get = (req, res, next) => {
  res.render("signin_form", {
    title: "Sign In",
  });
};

const signin_post = [
  passport.authenticate("local", { failureRedirect: "/signin" }),
  (req, res, next) => {
    res.redirect(req.user.url);
  },
];

const user_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("messages").exec();

  if (user === null) {
    res.redirect("/");
  }
  res.render("user_home", {
    title: "Profile",
    user,
  });
});

const signout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

const membership_get = (req, res, next) => {
  if (req.user) {
    res.render("membership_form", {
      title: "Membership",
      user: req.user,
    });
    return;
  }
  res.render("membership_form", {
    title: "Membership",
  });
};

const membership_post = asyncHandler(async (req, res, next) => {
  if (req.body.secret === "secret") {
    const user = await User.findById(req.user.id).exec();
    if (user === null) {
      res.redirect(req.user.id);
      return;
    }
    user.membership_status = true;
    await User.findByIdAndUpdate(req.user.id, user, {});
    res.redirect(user.url);
  } else {
    res.render("membership_form", {
      title: "Membership",
    });
  }
});

module.exports = {
  signup_get,
  signup_post,
  signin_get,
  signin_post,
  signout_get,
  user_get,
  membership_get,
  membership_post,
};
