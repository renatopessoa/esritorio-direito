import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

export class AuthService {
  static async login(email, password) {
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await user.validatePassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    logger.info(`User logged in: ${user.email}`);
    return { user, token };
  }

  static async register(userData) {
    const user = await User.create(userData);
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    logger.info(`New user registered: ${user.email}`);
    return { user, token };
  }
}