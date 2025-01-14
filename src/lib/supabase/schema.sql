-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    document_id VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address JSONB NOT NULL,
    notes TEXT,
    category VARCHAR(50) DEFAULT 'regular',
    status VARCHAR(50) DEFAULT 'active',
    CONSTRAINT valid_category CHECK (category IN ('regular', 'vip', 'premium')),
    CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'blocked'))
);

-- Create processes table
CREATE TABLE processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    number VARCHAR(50) NOT NULL UNIQUE,
    client_id UUID NOT NULL REFERENCES clients(id),
    responsible_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    court JSONB NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    priority VARCHAR(50) DEFAULT 'medium',
    CONSTRAINT valid_type CHECK (type IN ('civil', 'criminal', 'labor', 'tax', 'other')),
    CONSTRAINT valid_status CHECK (status IN ('active', 'archived', 'suspended')),
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high'))
);

-- Create deadlines table
CREATE TABLE deadlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    process_id UUID NOT NULL REFERENCES processes(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    CONSTRAINT valid_type CHECK (type IN ('hearing', 'petition', 'meeting', 'other')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'canceled'))
);

-- Create documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(1024) NOT NULL,
    type VARCHAR(50) NOT NULL,
    size INTEGER NOT NULL,
    process_id UUID REFERENCES processes(id),
    client_id UUID REFERENCES clients(id),
    version INTEGER DEFAULT 1,
    tags VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR[],
    CONSTRAINT valid_type CHECK (type IN ('petition', 'contract', 'evidence', 'other'))
);

-- Create financial_records table
CREATE TABLE financial_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    process_id UUID REFERENCES processes(id),
    client_id UUID REFERENCES clients(id),
    notes TEXT,
    CONSTRAINT valid_type CHECK (type IN ('income', 'expense')),
    CONSTRAINT valid_category CHECK (category IN ('fee', 'court_cost', 'travel', 'other')),
    CONSTRAINT valid_status CHECK (status IN ('paid', 'pending', 'overdue', 'canceled')),
    CONSTRAINT valid_payment_method CHECK (payment_method IN ('cash', 'credit_card', 'bank_transfer', 'other'))
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    active BOOLEAN DEFAULT true,
    registration VARCHAR(50),
    position VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(1024),
    CONSTRAINT valid_role CHECK (role IN ('admin', 'lawyer', 'assistant'))
);

-- Create indexes
CREATE INDEX idx_clients_document_id ON clients(document_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_processes_number ON processes(number);
CREATE INDEX idx_processes_client_id ON processes(client_id);
CREATE INDEX idx_deadlines_process_id ON deadlines(process_id);
CREATE INDEX idx_deadlines_date ON deadlines(date);
CREATE INDEX idx_documents_process_id ON documents(process_id);
CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_financial_records_process_id ON financial_records(process_id);
CREATE INDEX idx_financial_records_client_id ON financial_records(client_id);
CREATE INDEX idx_financial_records_date ON financial_records(date);
CREATE INDEX idx_users_email ON users(email);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processes_updated_at
    BEFORE UPDATE ON processes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deadlines_updated_at
    BEFORE UPDATE ON deadlines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_records_updated_at
    BEFORE UPDATE ON financial_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();