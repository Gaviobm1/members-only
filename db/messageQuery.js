const pool = require("./pool");

exports.findUserMessages = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM messages_view WHERE user_id = ($1)",
    [id]
  );
  return rows;
};

exports.findMessageById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM messages_view WHERE id = ($1)",
    [id]
  );
  return rows[0];
};

exports.findAllMessages = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM messages_view ORDER BY added DESC"
  );
  return rows;
};

exports.deleteMessage = async (id) => {
  await pool.query("DELETE FROM messages WHERE id = ($1)", [id]);
  return;
};

exports.addNewMessage = async (message) => {
  await pool.query(
    "INSERT INTO messages (title, text, user_id, added) VALUES (($1), ($2), ($3), ($4))",
    [message.title, message.text, message.user_id, message.added]
  );

  const { rows } = await pool.query(
    "SELECT * FROM messages_view WHERE user_id = ($1) AND added = ($2)",
    [message.user_id, message.added]
  );
  return rows[0];
};
