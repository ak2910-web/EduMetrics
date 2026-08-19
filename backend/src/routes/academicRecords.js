const express = require('express');
const { body, param } = require('express-validator');
const { AcademicRecord } = require('../models');
const { auth, allowRoles } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');
const validate = require('../utils/validate');

const router = express.Router();
router.use(apiLimiter);
router.use(auth);

router.get('/', allowRoles('teacher', 'admin'), async (req, res, next) => {
  try {
    return res.json(await AcademicRecord.findAll());
  } catch (error) {
    return next(error);
  }
});

router.post(
  '/',
  allowRoles('teacher', 'admin'),
  [
    body('studentId').isInt({ min: 1 }),
    body('subjectId').isInt({ min: 1 }),
    body('attendancePct').isFloat({ min: 0, max: 100 }),
    body('assignmentScore').isFloat({ min: 0, max: 100 }),
    body('quizScore').isFloat({ min: 0, max: 100 }),
    body('midtermScore').isFloat({ min: 0, max: 100 }),
    body('studyHours').isFloat({ min: 0 }),
    body('finalScore').optional().isFloat({ min: 0, max: 100 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const record = await AcademicRecord.create(req.body);
      return res.status(201).json(record);
    } catch (error) {
      return next(error);
    }
  }
);

router.put(
  '/:id',
  allowRoles('teacher', 'admin'),
  [param('id').isInt({ min: 1 })],
  validate,
  async (req, res, next) => {
    try {
      const record = await AcademicRecord.findByPk(req.params.id);
      if (!record) return res.status(404).json({ message: 'Record not found' });
      await record.update(req.body);
      return res.json(record);
    } catch (error) {
      return next(error);
    }
  }
);

router.delete(
  '/:id',
  allowRoles('teacher', 'admin'),
  [param('id').isInt({ min: 1 })],
  validate,
  async (req, res, next) => {
    try {
      const record = await AcademicRecord.findByPk(req.params.id);
      if (!record) return res.status(404).json({ message: 'Record not found' });
      await record.destroy();
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
