const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'AcademicRecord',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      attendancePct: { type: DataTypes.FLOAT, allowNull: false },
      assignmentScore: { type: DataTypes.FLOAT, allowNull: false },
      quizScore: { type: DataTypes.FLOAT, allowNull: false },
      midtermScore: { type: DataTypes.FLOAT, allowNull: false },
      finalScore: { type: DataTypes.FLOAT, allowNull: true },
      studyHours: { type: DataTypes.FLOAT, allowNull: false },
    },
    { tableName: 'academic_records', underscored: true }
  );
