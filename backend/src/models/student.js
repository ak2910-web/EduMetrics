const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Student',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      rollNo: { type: DataTypes.STRING, allowNull: false, unique: true },
      department: { type: DataTypes.STRING, allowNull: false },
      semester: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'students', underscored: true }
  );
