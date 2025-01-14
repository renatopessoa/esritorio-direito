import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.js';
import sequelize from './config/database.js';
import logger from './utils/logger.js';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Database connection and server start
sequelize.sync({ force: false }).then(() => {
  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });
}).catch(err => {
  logger.error('Unable to connect to the database:', err);
  process.exit(1);
});