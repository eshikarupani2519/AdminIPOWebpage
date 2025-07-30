const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const db = require("../models/db");
let user;
exports.login = async (req, res) => {
  const { email, password } = req.body; 
console.log("RAW req.body:", req.body);
console.log("Headers:", req.headers['content-type']);

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
     user = result.rows[0];

    if (!user) return res.status(401).json({ message: "Invalid email" });

   if (password !== user.password) {
  return res.status(401).json({ message: "Invalid password" });
}
;
    // const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    //   expiresIn: "1d",
    // });
    const token = jwt.sign(
  { id: user.id, role: user.role }, // Include role in payload
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);


   res.json({ 
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
  await db.query("INSERT INTO logs (user_id, action) VALUES ($1, $2)", [
  user.id,
  'Admin Login'
]);

};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Insert user into DB
    await db.query(
      "INSERT INTO users(name, email, password) VALUES ($1, $2, $3)",
      [name, email, password]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
