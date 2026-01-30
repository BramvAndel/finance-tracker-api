import { verifyToken } from '../services/auth.service.js';

/**
 * Middleware to verify JWT token from cookie or Authorization header
 */
export const authenticate = (req, res, next) => {
  try {
    let token;
    
    // First, try to get token from cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Fallback to Authorization header for API clients
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided. Please login.' });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
};

/**
 * Middleware to check if user is accessing their own resource
 */
export const isOwnerOrAdmin = (req, res, next) => {
  const userId = parseInt(req.params.id);
  
  if (req.user && (req.user.role === 'admin' || req.user.user_id === userId)) {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. You can only access your own resources.' });
  }
};
