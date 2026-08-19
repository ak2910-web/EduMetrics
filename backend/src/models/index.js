const sequelize = require('../config/database');

const User = require('./user')(sequelize);
const Student = require('./student')(sequelize);
const Subject = require('./subject')(sequelize);
const AcademicRecord = require('./academicRecord')(sequelize);
const Prediction = require('./prediction')(sequelize);

User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId' });

Student.hasMany(AcademicRecord, { foreignKey: 'studentId', onDelete: 'CASCADE' });
AcademicRecord.belongsTo(Student, { foreignKey: 'studentId' });

Subject.hasMany(AcademicRecord, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
AcademicRecord.belongsTo(Subject, { foreignKey: 'subjectId' });

Student.hasMany(Prediction, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Prediction.belongsTo(Student, { foreignKey: 'studentId' });

Subject.hasMany(Prediction, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
Prediction.belongsTo(Subject, { foreignKey: 'subjectId' });

module.exports = {
  sequelize,
  User,
  Student,
  Subject,
  AcademicRecord,
  Prediction,
};
