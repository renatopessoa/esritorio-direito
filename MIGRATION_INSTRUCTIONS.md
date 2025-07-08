# 🗄️ **INSTRUÇÕES PARA APLICAR MIGRATIONS NO SUPABASE**

## 🚀 **OPÇÃO 1: SQL Editor (RECOMENDADO)**

1. **Acesse o Supabase Dashboard**:

   ```
   https://xacjplyvtiwafchynyiy.supabase.co/project/default/sql
   ```

2. **Cole e execute o script**: `COMPLETE_MIGRATION.sql`

3. **Verifique se foi aplicado com sucesso**

## 🔧 **OPÇÃO 2: CLI (Se preferir)**

Se quiser tentar via CLI novamente:

```bash
# 1. Criar novo projeto Supabase (se necessário)
npx supabase projects create esritorio-direito

# 2. Linkar com novo projeto
npx supabase link --project-ref [novo-project-ref]

# 3. Aplicar migrations
npx supabase db push

# 4. Atualizar .env com novas credenciais
```

## ⚡ **OPÇÃO 3: Aplicação Manual via Dashboard**

Se o script completo der erro, aplique uma por vez:

### **1. Extensões e Tabelas Básicas**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clients table
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  document_id text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  address jsonb NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### **2. Users Profile Table**

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('ADMIN', 'LAWYER', 'ASSISTANT')),
  cpf text NOT NULL UNIQUE,
  birth_date date NOT NULL,
  phone text NOT NULL,
  landline text,
  address jsonb,
  position text NOT NULL,
  avatar_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### **3. RLS Policies**

```sql
-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "authenticated_users_manage_clients" ON clients
FOR ALL TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "users_own_data" ON users
FOR ALL USING (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) = 'ADMIN')
WITH CHECK (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) = 'ADMIN');
```

## ✅ **VERIFICAÇÃO**

Após aplicar as migrations, teste:

1. **No SQL Editor**:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

2. **Verificar RLS**:

```sql
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public';
```

3. **Testar autenticação** no sistema

## 🆘 **TROUBLESHOOTING**

### **Erro: Project not found**

- Projeto pode ter sido removido
- Crie novo projeto no Supabase
- Atualize credenciais no `.env`

### **Erro: Permission denied**

- Verifique se está logado no Supabase CLI
- Use `npx supabase login` novamente

### **Erro: Migration failed**

- Execute uma migration por vez
- Verifique se não há tabelas conflitantes

## 📞 **SUPORTE**

Se houver problemas:

1. Verifique o console do Supabase Dashboard
2. Execute as migrations manualmente via SQL Editor
3. Teste a conectividade com o frontend

---

**⚡ QUICK START**: Use o SQL Editor - é mais rápido e confiável!
