# ⚖️ **JurSys - Sistema de Gestão Jurídica**

Sistema completo de gestão para escritórios de direito, desenvolvido com **React + Vite + Supabase**.

## 🚀 **Características Principais**

- ✅ **Autenticação Real**: Supabase Auth com roles
- ✅ **Gestão de Clientes**: CRUD completo com busca avançada
- ✅ **Processos Jurídicos**: Acompanhamento e prazos
- ✅ **Agenda Integrada**: Sistema de compromissos
- ✅ **Financeiro**: Controle de receitas e despesas
- ✅ **IA/Jurimetria**: Análises preditivas e insights
- ✅ **Calculadoras**: INSS e Aposentadoria
- ✅ **Interface Moderna**: Design responsivo e intuitivo

## 🛠️ **Stack Tecnológica**

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui + Material UI
- **Backend**: Supabase (Database + Auth + Storage)
- **Estado**: Zustand + React Query
- **Roteamento**: React Router DOM v6
- **Validação**: Zod + React Hook Form

## 📦 **Instalação Rápida**

```bash
# Clone o repositório
git clone <url-do-repo>
cd esritorio-direito

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase

# Execute em desenvolvimento
npm run dev
```

## 🔧 **Configuração do Supabase**

1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as variáveis no `.env`:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

3. Execute as migrations em `supabase/migrations/`

## 📊 **Scripts Disponíveis**

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
npm run lint         # Verificar código
```

## 📁 **Estrutura do Projeto**

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Autenticação
│   ├── ui/             # UI base (shadcn/ui)
│   ├── clients/        # Gestão de clientes
│   ├── dashboard/      # Dashboard
│   └── AI/             # Ferramentas de IA
├── pages/              # Páginas principais
├── stores/             # Estado global (Zustand)
├── lib/                # Configurações e utils
├── services/           # APIs e serviços
└── types/              # TypeScript types
```

## 🔐 **Autenticação**

O sistema utiliza **Supabase Auth** com:

- Login/logout seguro
- Registro de usuários
- Roles: Admin, Advogado, Assistente
- Proteção de rotas
- Sessão persistente

Consulte `AUTHENTICATION.md` para detalhes.

## 🗄️ **Estratégia de Banco**

**Decisão**: Supabase agora → PostgreSQL na VPS futuramente

- **Fase Atual**: Supabase para desenvolvimento rápido
- **Migração Futura**: PostgreSQL direto quando atingir escala
- **Critérios**: Volume > 2000 clientes ou custo > R$ 300/mês

Consulte `DATABASE_STRATEGY.md` para análise completa.

## ⚡ **Performance**

- **Build Time**: ~2.2s
- **Bundle Size**: 362KB otimizado
- **Code Splitting**: Lazy loading em todas as páginas
- **Hot Reload**: ~200ms

Consulte `MIGRATION_ANALYSIS.md` para comparação Vite vs Next.js.

## 📋 **Funcionalidades**

### **Dashboard**

- Métricas em tempo real
- Gráficos interativos
- Alertas e notificações
- Prazos importantes

### **Clientes**

- CRUD completo
- Busca avançada
- Validação de CPF/CNPJ
- Endereço automático via CEP

### **Processos**

- Gestão de casos
- Acompanhamento de status
- Prazos e lembretes
- Documentos anexados

### **Financeiro**

- Receitas e despesas
- Honorários e custas
- Relatórios visuais
- Alertas de vencimento

### **IA/Jurimetria**

- Análises preditivas
- Classificação de documentos
- Redator assistente
- Insights estratégicos

## 🔄 **Roadmap**

### **Próximas Versões**

- [ ] PWA (Progressive Web App)
- [ ] Notificações push
- [ ] Relatórios PDF automáticos
- [ ] Integração com tribunais
- [ ] App mobile (React Native)

### **Melhorias Planejadas**

- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] AI enhancements
- [ ] Multi-tenancy

## 🐛 **Troubleshooting**

### **Problemas Comuns**

1. **Erro de CORS**: Verificar configuração do Supabase
2. **Build fails**: Limpar cache com `rm -rf node_modules && npm install`
3. **Auth issues**: Verificar variáveis de ambiente
4. **Performance**: Verificar network tab no DevTools

### **Logs Úteis**

```javascript
// Verificar autenticação
console.log(useAuthStore.getState());

// Verificar sessão Supabase
const session = await supabase.auth.getSession();
console.log(session);
```

## 📚 **Documentação**

- 📖 **AUTHENTICATION.md** - Guia completo de autenticação
- 📊 **DATABASE_STRATEGY.md** - Estratégia de banco de dados
- 🔄 **MIGRATION_ANALYSIS.md** - Análise Vite vs Next.js
- 🚀 **SUPABASE_OPTIMIZATIONS.md** - Otimizações implementadas
- 📋 **PROJECT_SUMMARY.md** - Resumo executivo

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 🚀 **Deploy**

### **Produção**

```bash
# Build
npm run build

# Deploy para Vercel/Netlify
# Simplesmente faça upload da pasta dist/
```

### **Variáveis de Produção**

- `VITE_SUPABASE_URL`: URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY`: Chave pública do Supabase

---

**⚖️ JurSys** - Gestão Jurídica Inteligente  
_Desenvolvido com ❤️ para advocacia moderna_
