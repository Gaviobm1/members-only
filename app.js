const express = require("express");
const session = require("express-session");
const path = require("path");
const passport = require("passport");
const localStrategy = require("./utilities/passportStrategy");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool");
const dbUser = require("./db/userQuery");
require("dotenv").config();

const app = express();

const siteRouter = require("./routes/siteRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    store: new pgSession({
      pool,
      tableName: process.env.SESSION_TABLE,
      pruneSessionInterval: 60 * 60,
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);
app.use(passport.session());

passport.use(localStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  dbUser
    .findUserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

app.use(siteRouter);
app.listen(8080, () => {
  console.log("Listening on 8080");
});
