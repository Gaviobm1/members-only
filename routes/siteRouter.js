const express = require("express");
const router = express.Router();
const passport = require("passport");
const user_controller = require("../controllers/user_controller");
const message_controller = require("../controllers/message_controller");

router.get("/", message_controller.index_message_get);

router.get("/signup", user_controller.signup_get);

router.post(
  "/signup",
  user_controller.signup_post,
  user_controller.signin_post
);

router.get("/signin", user_controller.signin_get);

router.post("/signin", user_controller.signin_post);

router.get("/users/:id", user_controller.user_get);

router.get("/logout", user_controller.signout_get);

router.get("/message", message_controller.message_form_get);

router.post("/message", message_controller.message_form_post);

router.get("/messages/:id", message_controller.message_detail_get);

router.get("/membership", user_controller.membership_get);

router.post("/membership", user_controller.membership_post);

router.get("/message/:id/delete", message_controller.message_delete_get);

router.post("/message/:id/delete", message_controller.message_delete_post);

router.get("/messages", message_controller.all_messages_get);

module.exports = router;
