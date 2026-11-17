const jwt = require("jsonwebtoken");

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (
    email !== process.env.SALES_EMAIL ||
    password !== process.env.SALES_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { email, role: "sales" },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({
    token,
    user: { email, role: "sales" }
  });
}

module.exports = { login };
