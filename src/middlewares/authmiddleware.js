import supabase from '../utils/supabase.js';

export const protectRoute = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized. No token provided.' });

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(403).json({ error: 'Invalid or expired token.' });

  req.user = user; // Attach user to request
  next(); // Move to next middleware/controller
};
