const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // fix typo
  const token = authHeader && authHeader.split(" ")[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // attaches user data (id, role, etc.)
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid or expired token" }); // should be 401, not 500
  }
};

exports.isAuthor = (req, res, next) => {
  if (req.user.role !== "author") {
    return res.status(403).json({ message: "Only Authors are allowed to perform this action" });
  }
  next();
};
