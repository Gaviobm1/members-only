const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const nconf = require("nconf");
const sessionStore = require("./utilities/mongoSession");
const passport = require("passport");
const localStrategy = require("./utilities/passportStrategy");
const User = require("./models/userSchema");

nconf.argv().env();

const app = express();

const mongoDb = nconf.get("MONGO_DB_URI");

mongoose
  .connect(mongoDb)
  .then((result) =>
    app.listen(8080, () => {
      console.log("Listening on 8080");
    })
  )
  .catch((err) => {
    console.log(err);
  });

const siteRouter = require("./routes/siteRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: nconf.get("SECRET"),
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);
app.use(passport.session());

passport.use(localStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

app.use(siteRouter);
