const isProduction = process.env.NODE_ENV === 'production';

const jwtSecret = process.env.JWT_SECRET;
if (isProduction && (!jwtSecret || jwtSecret.length < 32)) {
  throw new Error('JWT_SECRET precisa estar definido (mínimo 32 caracteres) em produção');
}

export const config = {
  isProduction,
  port: Number(process.env.PORT) || 3000,
  jwtSecret: jwtSecret || 'dev-only-secret-change-me-dev-only-secret',
  jwtExpiresIn: '8h' as const,
};
