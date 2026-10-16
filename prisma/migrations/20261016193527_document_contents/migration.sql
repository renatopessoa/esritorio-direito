-- AlterTable
ALTER TABLE "process_documents" ADD COLUMN     "size" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "document_contents" (
    "id" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "client_document_id" TEXT,
    "process_document_id" TEXT,

    CONSTRAINT "document_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_contents_client_document_id_key" ON "document_contents"("client_document_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_contents_process_document_id_key" ON "document_contents"("process_document_id");

-- AddForeignKey
ALTER TABLE "document_contents" ADD CONSTRAINT "document_contents_client_document_id_fkey" FOREIGN KEY ("client_document_id") REFERENCES "client_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_contents" ADD CONSTRAINT "document_contents_process_document_id_fkey" FOREIGN KEY ("process_document_id") REFERENCES "process_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
