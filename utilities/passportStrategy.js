const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");

const verifyCallback = (username, password, done) => {
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return done(null, false, { message: "Username not found" });
      }
      const match = bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    })
    .catch((err) => {
      return done(err);
    });
};

const localStrategy = new LocalStrategy(verifyCallback);

module.exports = localStrategy;
