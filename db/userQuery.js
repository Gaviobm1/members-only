const pool = require("./pool");

exports.findUserByUsername = async (username) => {
  const { rows } = await pool.query(
    "SELECT * FROM users_view WHERE username = ($1)",
    [username]
  );
  return rows.length > 0 ? rows[0] : rows;
};

exports.findUserById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM users_view WHERE id = ($1)",
    [id]
  );
  return rows[0];
};

exports.addUser = async (user) => {
  const { rows } = await pool.query(
    "INSERT INTO users (first_name, last_name, username, password, membership_status, admin) VALUES (($1), ($2), ($3), ($4), ($5), ($6)) RETURNING *",
    [
      user.first_name,
      user.last_name,
      user.username,
      user.password,
      user.membership_status,
      user.admin,
    ]
  );
  return rows[0];
};

exports.changeMembership = async (id, user) => {
  await pool.query("UPDATE users SET membership_status=($1) WHERE id = ($2)", [
    user.membership_status,
    user.id,
  ]);
};
