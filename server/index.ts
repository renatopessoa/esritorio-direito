import express, { Router } from 'express';
import helmet from 'helmet';
import path from 'node:path';
import fs from 'node:fs';
import { config } from './config';
import { errorHandler, HttpError } from './lib/http';
import { prisma } from './lib/prisma';
import { requireAuth } from './middleware/auth';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { clientsRouter } from './routes/clients';
import { deadlinesRouter, processesRouter } from './routes/processes';
import { calendarRouter } from './routes/calendar';
import { financialRouter } from './routes/financial';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // atrás do proxy do Coolify (Traefik)
app.use(express.json({ limit: '1mb' }));

const api = Router();

api.get('/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok' });
});

api.use('/auth', authRouter);

// Tudo abaixo exige login
api.use(requireAuth);
api.use('/users', usersRouter);
api.use('/clients', clientsRouter);
api.use('/processes', processesRouter);
api.use('/deadlines', deadlinesRouter);
api.use('/calendar-events', calendarRouter);
api.use('/financial', financialRouter);

api.use(() => {
  throw new HttpError(404, 'Rota não encontrada');
});
api.use(errorHandler);

app.use('/api', helmet(), api);

// Em produção o mesmo servidor entrega o frontend compilado pelo Vite
const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          // ViaCEP é chamado direto pelo navegador
          'connect-src': ["'self'", 'https://viacep.com.br'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'upgrade-insecure-requests': null,
        },
      },
    }),
  );
  app.use(express.static(distDir, { index: false, maxAge: '1h' }));
  app.get('/{*splat}', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

app.listen(config.port, () => {
  console.log(`JurSys rodando na porta ${config.port}`);
});
