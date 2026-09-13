import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ========================================
    // CHECK AUTH HEADER
    // ========================================

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Not authorized. Token missing."
      });
    }

    // ========================================
    // GET TOKEN
    // ========================================

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing"
      });
    }

    // ========================================
    // VERIFY TOKEN
    // ========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    // ========================================
    // GET USER ID
    // ========================================

    const userId =
      decoded.userId ||
      decoded.id ||
      decoded._id;

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found in token"
      });
    }

    // ========================================
    // ATTACH USER
    // ========================================

    req.user = {
      userId,
      role: decoded.role
    };


    next();

  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

