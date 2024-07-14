const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const nconf = require("nconf");

nconf.argv().env();

const app = express();

const siteRouter = require("./routes/siteRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(siteRouter);

app.listen(8080, () => {
  console.log("Listening on 8080");
});
