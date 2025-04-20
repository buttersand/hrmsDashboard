import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    const issuedAt = new Date(decoded.iat * 1000);
    const now = new Date();
    const diff = (now - issuedAt) / (1000 * 60 * 60); 
    if (diff > 2) return res.status(401).json({ message: 'Session expired' });

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
