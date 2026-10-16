import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { HttpError, param, parse } from '../lib/http';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;

// Tipo do arquivo é decidido pela extensão, nunca pelo Content-Type enviado pelo navegador
const ALLOWED_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.txt': 'text/plain',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES, fields: 5 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES[path.extname(file.originalname).toLowerCase()]) cb(null, true);
    else cb(new HttpError(400, `Tipo de arquivo não permitido: ${file.originalname}`));
  },
});

/** Recebe o campo "files" e traduz os erros do multer para mensagens claras. */
function receiveFiles(req: Request, res: Response, next: NextFunction) {
  upload.array('files', MAX_FILES)(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      const messages: Partial<Record<string, string>> = {
        LIMIT_FILE_SIZE: 'Arquivo maior que 10 MB',
        LIMIT_FILE_COUNT: `Envie no máximo ${MAX_FILES} arquivos por vez`,
      };
      return next(new HttpError(400, messages[err.code] ?? 'Upload inválido'));
    }
    if (err) return next(err);
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) return next(new HttpError(400, 'Nenhum arquivo enviado (campo "files")'));
    next();
  });
}

// O nome chega em latin1 pelo busboy; normaliza para UTF-8 e remove caminhos
function fileName(file: Express.Multer.File) {
  return path.basename(Buffer.from(file.originalname, 'latin1').toString('utf8')).slice(0, 255);
}

function mimeOf(file: Express.Multer.File) {
  return ALLOWED_TYPES[path.extname(file.originalname).toLowerCase()];
}

const downloadUrl = (kind: 'client' | 'process', id: string) => `/api/documents/${kind}/${id}/download`;

// ---------- Rotas aninhadas: /clients/:id/documents e /processes/:id/documents ----------

export const clientDocumentsRouter = Router({ mergeParams: true });

clientDocumentsRouter.get('/', async (req, res) => {
  const documents = await prisma.clientDocument.findMany({
    where: { clientId: param(req, 'id') },
    orderBy: { createdAt: 'desc' },
  });
  res.json(documents);
});

clientDocumentsRouter.post('/', receiveFiles, async (req, res) => {
  const clientId = param(req, 'id');
  await prisma.client.findUniqueOrThrow({ where: { id: clientId }, select: { id: true } });

  const files = req.files as Express.Multer.File[];
  const documents = await prisma.$transaction(
    files.map((file) => {
      const id = randomUUID();
      return prisma.clientDocument.create({
        data: {
          id,
          clientId,
          name: fileName(file),
          type: mimeOf(file),
          size: file.size,
          url: downloadUrl('client', id),
          content: { create: { data: file.buffer } },
        },
      });
    }),
  );
  res.status(201).json(documents);
});

export const processDocumentsRouter = Router({ mergeParams: true });

processDocumentsRouter.get('/', async (req, res) => {
  const documents = await prisma.processDocument.findMany({
    where: { processId: param(req, 'id') },
    orderBy: { uploadedAt: 'desc' },
  });
  res.json(documents);
});

processDocumentsRouter.post('/', receiveFiles, async (req, res) => {
  const processId = param(req, 'id');
  await prisma.process.findUniqueOrThrow({ where: { id: processId }, select: { id: true } });

  const files = req.files as Express.Multer.File[];
  const documents = await prisma.$transaction(
    files.map((file) => {
      const id = randomUUID();
      return prisma.processDocument.create({
        data: {
          id,
          processId,
          title: fileName(file),
          type: mimeOf(file),
          size: file.size,
          url: downloadUrl('process', id),
          content: { create: { data: file.buffer } },
        },
      });
    }),
  );
  res.status(201).json(documents);
});

// ---------- /documents: listagem geral, download e exclusão ----------

export const documentsRouter = Router();

const kindSchema = z.enum(['client', 'process']);

/** Todos os documentos (clientes e processos) num formato único, para a tela Documentos. */
documentsRouter.get('/', async (req, res) => {
  const { search } = parse(z.object({ search: z.string().trim().optional() }), req.query);
  const contains = search ? { contains: search, mode: 'insensitive' as const } : undefined;

  const [clientDocs, processDocs] = await prisma.$transaction([
    prisma.clientDocument.findMany({
      where: contains ? { OR: [{ name: contains }, { client: { name: contains } }] } : {},
      include: { client: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.processDocument.findMany({
      where: contains
        ? { OR: [{ title: contains }, { process: { number: contains } }, { process: { client: { name: contains } } }] }
        : {},
      include: { process: { select: { id: true, number: true, client: { select: { name: true } } } } },
      orderBy: { uploadedAt: 'desc' },
      take: 200,
    }),
  ]);

  const documents = [
    ...clientDocs.map((d) => ({
      id: d.id,
      kind: 'client' as const,
      name: d.name,
      type: d.type,
      size: d.size,
      uploadedAt: d.createdAt,
      owner: { id: d.client.id, label: d.client.name },
    })),
    ...processDocs.map((d) => ({
      id: d.id,
      kind: 'process' as const,
      name: d.title,
      type: d.type,
      size: d.size,
      uploadedAt: d.uploadedAt,
      owner: { id: d.process.id, label: `${d.process.number} — ${d.process.client.name}` },
    })),
  ].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

  res.json(documents);
});

documentsRouter.get('/:kind/:id/download', async (req, res) => {
  const kind = parse(kindSchema, req.params.kind);
  const id = param(req, 'id');

  const doc =
    kind === 'client'
      ? await prisma.clientDocument.findUniqueOrThrow({ where: { id }, include: { content: true } })
      : await prisma.processDocument.findUniqueOrThrow({ where: { id }, include: { content: true } });
  if (!doc.content) throw new HttpError(404, 'Conteúdo do arquivo não encontrado');

  const name = 'name' in doc ? doc.name : doc.title;
  res.setHeader('Content-Type', doc.type);
  res.setHeader('Content-Length', doc.content.data.length);
  // Sempre como anexo: o navegador nunca renderiza o arquivo dentro do app
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${name.replace(/[^\x20-\x7e]|"/g, '_')}"; filename*=UTF-8''${encodeURIComponent(name)}`,
  );
  res.setHeader('Cache-Control', 'private, no-store');
  res.end(Buffer.from(doc.content.data));
});

documentsRouter.delete('/:kind/:id', async (req, res) => {
  const kind = parse(kindSchema, req.params.kind);
  const id = param(req, 'id');
  if (kind === 'client') await prisma.clientDocument.delete({ where: { id } });
  else await prisma.processDocument.delete({ where: { id } });
  res.status(204).end();
});
