CREATE TABLE IF NOT EXISTS "Clients" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "document" VARCHAR(255) NOT NULL UNIQUE,
  "type" VARCHAR(15) CHECK ("type" IN ('pessoa_fisica', 'pessoa_juridica')) NOT NULL,
  "email" VARCHAR(255),
  "phone" VARCHAR(255),
  "address" TEXT,
  "birthDate" DATE,
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Índices para melhorar a performance das consultas
CREATE INDEX IF NOT EXISTS "idx_clients_document" ON "Clients" ("document");
CREATE INDEX IF NOT EXISTS "idx_clients_name" ON "Clients" ("name");
CREATE INDEX IF NOT EXISTS "idx_clients_email" ON "Clients" ("email");
CREATE INDEX IF NOT EXISTS "idx_clients_type" ON "Clients" ("type");
