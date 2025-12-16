import { verifyToken } from '../utils/jwt.js';

export const authenticateToken = (req, res, next) => {
  // Get token from Authorization header (stored in sessionStorage)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  req.username = decoded.username;
  next();
};
