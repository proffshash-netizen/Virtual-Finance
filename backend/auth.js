const jwt = require('jsonwebtoken');

const JWT_SECRET = 'FINLIT_DEV_SECRET_DO_NOT_USE_IN_PRODUCTION';

const generateToken = (userId, role, expiresIn = '1h') => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn });
};

const authMiddleware = (requiredRole = null) => {
  return (req, res, next) => {
    const cookieName = requiredRole === 'admin' ? 'finlit_admin_session' : 'finlit_player_session';
    const token = req.cookies[cookieName] || req.cookies.finlit_session;
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No session found' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
    }
  };
};

module.exports = {
  generateToken,
  authMiddleware
};
