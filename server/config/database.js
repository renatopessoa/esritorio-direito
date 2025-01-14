import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use SQLite as a fallback when PostgreSQL is not available
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: process.env.NODE_ENV === 'development',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;