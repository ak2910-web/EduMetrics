const express = require('express');
const { body, param } = require('express-validator');
const { Subject } = require('../models');
const { auth, allowRoles } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');
const validate = require('../utils/validate');

const router = express.Router();
router.use(apiLimiter);
router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    return res.json(await Subject.findAll());
  } catch (error) {
    return next(error);
  }
});

router.post(
  '/',
  allowRoles('admin', 'teacher'),
  [body('name').trim().notEmpty(), body('code').trim().notEmpty(), body('semester').isInt({ min: 1 })],
  validate,
  async (req, res, next) => {
    try {
      const subject = await Subject.create(req.body);
      return res.status(201).json(subject);
    } catch (error) {
      return next(error);
    }
  }
);

router.put(
  '/:id',
  allowRoles('admin', 'teacher'),
  [param('id').isInt({ min: 1 })],
  validate,
  async (req, res, next) => {
    try {
      const subject = await Subject.findByPk(req.params.id);
      if (!subject) return res.status(404).json({ message: 'Subject not found' });
      await subject.update(req.body);
      return res.json(subject);
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
      const subject = await Subject.findByPk(req.params.id);
      if (!subject) return res.status(404).json({ message: 'Subject not found' });
      await subject.destroy();
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
