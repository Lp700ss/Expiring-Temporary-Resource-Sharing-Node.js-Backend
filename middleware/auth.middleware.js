const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user payload to request object

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle different JWT verification errors
    const errorMessage =
      error.name === 'TokenExpiredError'
        ? 'Token has expired. Please login again.'
        : 'Invalid token.';
    return res.status(401).json({ error: errorMessage });
  }
};

module.exports = authMiddleware;
