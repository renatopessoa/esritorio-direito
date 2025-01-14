import { AuthService } from '../services/auth.service.js';
import logger from '../utils/logger.js';

export class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(401).json({ message: error.message });
    }
  }

  static async register(req, res) {
    try {
      const { user, token } = await AuthService.register(req.body);

      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(400).json({ message: error.message });
    }
  }
}