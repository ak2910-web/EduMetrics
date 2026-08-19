const express = require('express');
const { param } = require('express-validator');
const { AcademicRecord, Prediction, Student } = require('../models');
const { auth, allowRoles } = require('../middleware/auth');
const validate = require('../utils/validate');

const router = express.Router();
router.use(auth);

router.get(
  '/class/:subjectId',
  allowRoles('teacher', 'admin'),
  [param('subjectId').isInt({ min: 1 })],
  validate,
  async (req, res, next) => {
    try {
      const subjectId = Number(req.params.subjectId);
      const records = await AcademicRecord.findAll({ where: { subjectId } });
      const predictions = await Prediction.findAll({ where: { subjectId }, include: [{ model: Student }] });

      const avgFinalScore =
        records.length > 0
          ? records.reduce((acc, r) => acc + (r.finalScore || 0), 0) / records.length
          : 0;

      const riskDistribution = predictions.reduce(
        (acc, p) => {
          acc[p.riskLevel] = (acc[p.riskLevel] || 0) + 1;
          return acc;
        },
        { Low: 0, Medium: 0, High: 0 }
      );

      const atRiskStudents = predictions
        .filter((p) => p.riskLevel !== 'Low')
        .map((p) => ({
          studentId: p.studentId,
          rollNo: p.Student?.rollNo,
          riskLevel: p.riskLevel,
          predictedGrade: p.predictedGrade,
        }));

      return res.json({ avgFinalScore, riskDistribution, atRiskStudents });
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  '/student/:studentId',
  allowRoles('student', 'teacher', 'admin'),
  [param('studentId').isInt({ min: 1 })],
  validate,
  async (req, res, next) => {
    try {
      const studentId = Number(req.params.studentId);
      if (req.user.role === 'student') {
        const studentProfile = await Student.findOne({ where: { userId: req.user.id } });
        if (!studentProfile || studentProfile.id !== studentId) {
          return res.status(403).json({ message: 'Forbidden' });
        }
      }

      const predictionHistory = await Prediction.findAll({
        where: { studentId },
        order: [['predictedAt', 'ASC']],
      });

      const trend = predictionHistory.map((item) => ({
        date: item.predictedAt,
        predictedGrade: item.predictedGrade,
        riskLevel: item.riskLevel,
      }));

      return res.json({ predictionHistory, trend });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
