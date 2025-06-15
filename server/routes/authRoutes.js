import express from 'express';
import { login, register } from '../controllers/authController.js';
import User from '../models/User.js'; // ✅ This is the fix

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

// ✅ Check username availability route
router.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await User.findOne({ username });
    res.json({ exists: !!user }); // true if user exists
  } catch (err) {
    console.error('Username check error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

