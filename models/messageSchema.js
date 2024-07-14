const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, required: true },
});

messageSchema.virtual("url").get(function () {
  return `/messages/${this._id}`;
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
