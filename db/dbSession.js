const session = require("express-session");
const pool = require("./pool");
const pgSession = require("connect-pg-simple")(session);
require("dotenv").config();

module.exports = new pgSession({
  pool,
  tableName: process.env.SESSION_TABLE,
  pruneSessionInterval: 60 * 60,
});
