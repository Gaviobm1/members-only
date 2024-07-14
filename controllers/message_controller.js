const Message = require("../models/messageSchema");
const User = require("../models/userSchema");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const { DateTime } = require("luxon");

const index_message_get = asyncHandler(async (req, res, next) => {
  if (req.user) {
    res.redirect(req.user.url);
    return;
  }
  const messages = await Message.find().sort({ timestamp: -1 }).exec();
  res.render("index", {
    title: "Home",
    messages,
  });
});

const message_form_get = (req, res, next) => {
  res.render("message_form", {
    title: "New Message",
  });
};

const message_form_post = [
  body("title", "Title is required").trim().isLength({ min: 1 }).escape(),
  body("text", "Text is required").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      author: req.user,
      timestamp: new Date(),
    });
    if (!errors.isEmpty()) {
      res.render("message_form", {
        title: "New Message",
        message,
        errors: errors.array(),
      });
      return;
    } else {
      const user = await User.findById(req.user.id);
      user.messages.push(message);
      await message.save();
      await User.findByIdAndUpdate(req.user.id, user, {});
      res.redirect(message.url);
    }
  }),
];

const message_detail_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();

  if (message === null) {
    res.redirect("/");
  }
  const date = DateTime.fromJSDate(new Date(message.timestamp))
    .setLocale("en-GB")
    .toLocaleString(DateTime.DATETIME_MED);
  if (req.user) {
    res.render("message_detail", {
      title: "Message details",
      message,
      date,
      user: req.user,
    });
  } else {
    res.render("message_detail", {
      title: "Message details",
      message,
      date,
    });
  }
});

const all_messages_get = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().sort({ timestamp: -1 }).exec();
  res.render("messages_list", {
    title: "All messages",
    messages,
  });
});

const message_delete_get = asyncHandler(async (req, res, next) => {
  if (req.user) {
    const message = await Message.findById(req.params.id).exec();
    if (message === null) {
      res.redirect(req.user.url);
      return;
    }
    res.render("message_delete", {
      title: "Delete message",
      user: req.user,
      message,
    });
  }
});

const message_delete_post = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.body.delete_message).exec();
  res.redirect("/messages");
});

module.exports = {
  index_message_get,
  message_form_get,
  message_form_post,
  message_detail_get,
  all_messages_get,
  message_delete_get,
  message_delete_post,
};
