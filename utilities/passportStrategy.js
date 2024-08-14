const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const dbUser = require("../db/userQuery");

const verifyCallback = (username, password, done) => {
  dbUser
    .findUserByUsername(username)
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
