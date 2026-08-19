const jwt = require("jsonwebtoken");
const User = require("../models/User");
exports.protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    token = token.split(" ")[1];
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// 🛡️ Role-based access
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};