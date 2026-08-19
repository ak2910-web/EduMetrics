const express = require('express');
const { body, param } = require('express-validator');
const { Student, User } = require('../models');
const { auth, allowRoles } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');
const validate = require('../utils/validate');

const router = express.Router();
router.use(apiLimiter);
router.use(auth);

router.get('/', allowRoles('teacher', 'admin'), async (req, res, next) => {
  try {
    const students = await Student.findAll({ include: [{ model: User, attributes: ['id', 'name', 'email'] }] });
    return res.json(students);
  } catch (error) {
    return next(error);
  }
});

router.post(
  '/',
  allowRoles('admin'),
  [
    body('userId').isInt({ min: 1 }),
    body('rollNo').trim().notEmpty(),
    body('department').trim().notEmpty(),
    body('semester').isInt({ min: 1 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const student = await Student.create(req.body);
      return res.status(201).json(student);
    } catch (error) {
      return next(error);
    }
  }
);

router.put(
  '/:id',
  allowRoles('admin'),
  [param('id').isInt({ min: 1 })],
  validate,
  async (req, res, next) => {
    try {
      const student = await Student.findByPk(req.params.id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      await student.update(req.body);
      return res.json(student);
    } catch (error) {
      return next(error);
    }
  }
);

router.delete(
  '/:id',
  allowRoles('admin'),
  [param('id').isInt({ min: 1 })],
  validate,
  async (req, res, next) => {
    try {
      const student = await Student.findByPk(req.params.id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      await student.destroy();
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
