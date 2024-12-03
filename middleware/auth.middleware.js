const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("JWT_SECRET:", JWT_SECRET);

    req.user = decoded;  // Attach user to request object
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token during upload' });
  }
};

module.exports = authMiddleware;
