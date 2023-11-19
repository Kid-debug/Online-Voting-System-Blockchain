const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const extractedToken = token.split(" ")[1];
  jwt.verify(
    extractedToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "The token is expired" });
      }
      req.user = {
        email: decoded.email,
        role: decoded.role,
      };
      next();
    }
  );
};

module.exports = verifyJWT;
