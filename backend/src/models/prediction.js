const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Prediction',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      predictedGrade: { type: DataTypes.FLOAT, allowNull: false },
      riskLevel: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        allowNull: false,
      },
      confidenceScore: { type: DataTypes.FLOAT, allowNull: false },
      modelVersion: { type: DataTypes.STRING, allowNull: false, defaultValue: 'v1' },
      predictedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    { tableName: 'predictions', underscored: true, timestamps: false }
  );
