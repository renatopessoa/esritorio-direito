import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Case = sequelize.define('Case', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  court: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'closed', 'archived'),
    defaultValue: 'pending'
  },
  description: {
    type: DataTypes.TEXT
  },
  dueDate: {
    type: DataTypes.DATE
  }
});

export default Case;