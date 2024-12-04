const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("JWT_SECRET:", JWT_SECRET);


    req.user = decoded;
    // req.user = await db.User.findByPk(decoded.id);   // Attach user to request object
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token during upload' });
  }
};

module.exports = authMiddleware;
