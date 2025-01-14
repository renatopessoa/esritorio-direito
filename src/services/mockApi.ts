// Simulação de banco de dados em memória
let clients: any[] = [];
let processes: any[] = [];
let documents: any[] = [];

// Função auxiliar para simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Clientes
  async createClient(data: any) {
    await delay(500); // Simula latência
    const newClient = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    clients.push(newClient);
    return newClient;
  },

  async updateClient(id: string, data: any) {
    await delay(500);
    const index = clients.findIndex(client => client.id === id);
    if (index === -1) throw new Error('Cliente não encontrado');
    
    clients[index] = {
      ...clients[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return clients[index];
  },

  async deleteClient(id: string) {
    await delay(500);
    const index = clients.findIndex(client => client.id === id);
    if (index === -1) throw new Error('Cliente não encontrado');
    clients = clients.filter(client => client.id !== id);
  },

  async getClient(id: string) {
    await delay(500);
    const client = clients.find(client => client.id === id);
    if (!client) throw new Error('Cliente não encontrado');
    return client;
  },

  async listClients() {
    await delay(500);
    return clients;
  },

  // Processos
  async createProcess(data: any) {
    await delay(500);
    const newProcess = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    processes.push(newProcess);
    return newProcess;
  },

  async updateProcess(id: string, data: any) {
    await delay(500);
    const index = processes.findIndex(process => process.id === id);
    if (index === -1) throw new Error('Processo não encontrado');
    
    processes[index] = {
      ...processes[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return processes[index];
  },

  async deleteProcess(id: string) {
    await delay(500);
    const index = processes.findIndex(process => process.id === id);
    if (index === -1) throw new Error('Processo não encontrado');
    processes = processes.filter(process => process.id !== id);
  },

  async getProcess(id: string) {
    await delay(500);
    const process = processes.find(process => process.id === id);
    if (!process) throw new Error('Processo não encontrado');
    return process;
  },

  async listProcesses() {
    await delay(500);
    return processes;
  },

  // Documentos
  async uploadDocument(data: any) {
    await delay(1000); // Upload é geralmente mais lento
    const newDocument = {
      id: crypto.randomUUID(),
      ...data,
      uploadedAt: new Date().toISOString(),
    };
    documents.push(newDocument);
    return newDocument;
  },

  async deleteDocument(id: string) {
    await delay(500);
    const index = documents.findIndex(doc => doc.id === id);
    if (index === -1) throw new Error('Documento não encontrado');
    documents = documents.filter(doc => doc.id !== id);
  },

  async listDocuments(filters: any = {}) {
    await delay(500);
    let filtered = [...documents];
    
    if (filters.processId) {
      filtered = filtered.filter(doc => doc.processId === filters.processId);
    }
    if (filters.clientId) {
      filtered = filtered.filter(doc => doc.clientId === filters.clientId);
    }
    
    return filtered;
  },
};