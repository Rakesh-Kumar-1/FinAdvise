import jwt from 'jsonwebtoken'

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies?.token;
  
    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    try {
      req.user = jwt.verify(token, process.env.SECRET_KEY);
      next();
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
  