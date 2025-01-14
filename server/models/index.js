import sequelize from '../config/database.js';
import User from './User.js';
import Case from './Case.js';
import Party from './Party.js';

// Define relationships
Case.belongsToMany(Party, { through: 'CaseParties' });
Party.belongsToMany(Case, { through: 'CaseParties' });

Case.belongsTo(User, { as: 'assignedLawyer', foreignKey: 'lawyerId' });
User.hasMany(Case, { as: 'assignedCases', foreignKey: 'lawyerId' });

export { sequelize, User, Case, Party };