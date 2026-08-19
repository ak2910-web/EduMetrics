const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { User } = require('../models');
const validate = require('../utils/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['student', 'teacher', 'admin']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash, role });
      return res.status(201).json({ id: user.id, email: user.email, role: user.role });
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '1d' }
      );

      return res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
