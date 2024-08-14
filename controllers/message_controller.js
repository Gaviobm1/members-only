const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { DateTime } = require("luxon");
const dbMessages = require("../db/messageQuery");

const index_message_get = asyncHandler(async (req, res, next) => {
  if (req.user) {
    res.redirect(req.user.url);
    return;
  }
  const messages = await dbMessages.findAllMessages();
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
    const message = {
      title: req.body.title,
      text: req.body.text,
      added: new Date(),
      user_id: req.user.id,
    };
    if (!errors.isEmpty()) {
      res.render("message_form", {
        title: "New Message",
        message,
        errors: errors.array(),
      });
      return;
    } else {
      const newMessage = await dbMessages.addNewMessage(message);
      res.redirect(newMessage.url);
    }
  }),
];

const message_detail_get = asyncHandler(async (req, res, next) => {
  const message = await dbMessages.findMessageById(req.params.id);

  if (message === null) {
    res.redirect("/");
  }
  const date = DateTime.fromJSDate(new Date(message.added))
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
  const messages = await dbMessages.findAllMessages();
  res.render("messages_list", {
    title: "All messages",
    messages,
  });
});

const message_delete_get = asyncHandler(async (req, res, next) => {
  if (req.user) {
    const message = await dbMessages.findMessageById(req.params.id);
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
  await dbMessages.deleteMessage(req.body.delete_message);
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
