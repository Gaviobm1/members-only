const MongoStore = require("connect-mongo");
const nconf = require("nconf");
const path = require("path");

nconf.file({ file: path.join(__dirname, "../config.json") });

const sessionStore = new MongoStore({
  mongoUrl: nconf.get("MONGO_DB_URI"),
  collectionName: "sessions",
});

module.exports = sessionStore;
