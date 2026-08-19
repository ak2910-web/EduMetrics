const express = require('express');
const axios = require('axios');
const { body } = require('express-validator');
const { AcademicRecord, Prediction } = require('../models');
const { auth, allowRoles } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');
const validate = require('../utils/validate');

const router = express.Router();
router.use(apiLimiter);
router.use(auth);

router.post(
  '/generate',
  allowRoles('teacher', 'admin', 'student'),
  [body('studentId').isInt({ min: 1 }), body('subjectId').isInt({ min: 1 })],
  validate,
  async (req, res, next) => {
    try {
      const { studentId, subjectId } = req.body;
      const record = await AcademicRecord.findOne({ where: { studentId, subjectId } });
      if (!record) return res.status(404).json({ message: 'Academic record not found' });

      const mlBaseUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
      const mlResponse = await axios.post(`${mlBaseUrl}/predict`, {
        attendance_pct: record.attendancePct,
        assignment_score: record.assignmentScore,
        quiz_score: record.quizScore,
        midterm_score: record.midtermScore,
        study_hours: record.studyHours,
      });

      const prediction = await Prediction.create({
        studentId,
        subjectId,
        predictedGrade: mlResponse.data.predicted_grade,
        riskLevel: mlResponse.data.risk_level,
        confidenceScore: mlResponse.data.confidence_score,
        modelVersion: mlResponse.data.model_version || 'v1',
      });

      return res.status(201).json(prediction);
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
