

import jwt from "jsonwebtoken";

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      let token = null;

      // 1️⃣ Check Authorization header
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }

      // 2️⃣ Fallback: custom header (optional)
      if (!token) {
        token = req.headers["x-auth-token"];
      }

      // 3️⃣ No token
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // 4️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded = { id, role, iat, exp }

      // 5️⃣ Attach user info
      req.user = decoded;
      req.userId = decoded.id; // optional shortcut

      // 6️⃣ Role-based authorization
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (err) {
      console.error("Auth middleware error:", err);

      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default authMiddleware;
