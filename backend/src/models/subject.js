const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Subject',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
      semester: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'subjects', underscored: true }
  );
