const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  membership_status: { type: Boolean, required: true },
  is_admin: { type: Boolean, default: false },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

userSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

userSchema.virtual("url").get(function () {
  return `/users/${this._id}`;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
