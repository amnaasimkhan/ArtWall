import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token (extract token) also if in format of "Bearer token" it will split and take the second part(which is token)

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401);
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};