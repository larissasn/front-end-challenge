
# Desafio Agent UI

🚀 **Template de avaliação técnica full-stack para desenvolvedores frontend**

Um template completo de projeto com funcionalidades de upload de arquivos, integração de agentes IA, interface de chat streaming e capacidades de processamento de arquivos. Construído com Next.js 14, FastAPI e integração OpenRouter.

## 📋 Visão Geral do Projeto

Este projeto serve como uma avaliação técnica para desenvolvedores frontend, fornecendo uma base sólida com funcionalidades-chave implementadas, deixando áreas estratégicas para os candidatos demonstrarem suas habilidades.

### 🎯 Objetivos da Avaliação

- **Desenvolvimento Frontend**: Proficiência em React/Next.js com padrões modernos
- **Integração de API**: APIs RESTful e respostas streaming
- **Gerenciamento de Estado**: Manipulação de estado complexo da aplicação
- **Experiência do Usuário**: Interfaces intuitivas e tratamento de erros
- **Recursos em Tempo Real**: Implementação de chat streaming
- **Manipulação de Arquivos**: Pipeline de upload/download com processamento

## 🏗️ Arquitetura

### Backend (FastAPI)
- **Sistema de Upload de Arquivos**: Manipulação segura de arquivos .txt com validação
- **Integração de Agente IA**: API OpenRouter com capacidades de streaming
- **Pipeline de Processamento**: Análise automática de conteúdo e resumos
- **API RESTful**: Endpoints bem documentados com tratamento adequado de erros

### Frontend (Next.js 14)
- **React Moderno**: App Router com Componentes Server/Client
- **UI Responsiva**: Tailwind CSS + componentes Shadcn UI
- **Segurança de Tipos**: Implementação completa em TypeScript
- **Chat Streaming**: Interface de conversa IA em tempo real

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ e yarn
- Python 3.11+ e pip
- Chave API OpenRouter (opcional para funcionalidade completa)

### 1. Configuração do Backend

```bash
# Navegar para o diretório backend
cd backend

# Instalar dependências Python
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com sua chave API OpenRouter

# Iniciar o servidor FastAPI
python main.py
```

O backend estará disponível em `http://localhost:8000`
- Documentação da API: `http://localhost:8000/docs`
- Verificação de Saúde: `http://localhost:8000/health`

### 2. Configuração do Frontend

```bash
# Navegar para o diretório frontend
cd app

# Instalar dependências Node.js
yarn install

# Iniciar o servidor de desenvolvimento
yarn dev
```

O frontend estará disponível em `http://localhost:3000`

### 3. Configuração

#### Chave API OpenRouter (Necessária para recursos de IA)
1. Registre-se em [OpenRouter](https://openrouter.ai/)
2. Obtenha sua chave API
3. Adicione-a ao `backend/.env`:
   ```
   OPENROUTER_API_KEY=sua_chave_aqui
   ```

#### Variáveis de Ambiente

**Backend (`backend/.env`):**
```env
OPENROUTER_API_KEY=sua_chave_api_openrouter_aqui
OPENROUTER_MODEL=anthropic/claude-3-haiku
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
AGENT_NAME=FileProcessorAgent
MAX_FILE_SIZE_MB=10
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Frontend (`app/.env`):**
```env
BACKEND_URL=http://localhost:8000
```

## 📁 Estrutura do Projeto

```
agent_ui_challenge/
├── backend/                 # Backend FastAPI
│   ├── app/
│   │   ├── routes/         # Endpoints da API
│   │   │   ├── upload.py   # Manipulação de upload de arquivos
│   │   │   ├── chat.py     # Endpoints de chat streaming
│   │   │   └── download.py # Processamento e download de arquivos
│   │   ├── services/       # Lógica de negócio
│   │   │   ├── file_processor.py    # Manipulação de arquivos
│   │   │   └── agent_service.py     # Integração IA
│   │   ├── models.py       # Esquemas Pydantic
│   │   └── config.py       # Gerenciamento de configuração
│   ├── uploads/            # Armazenamento de arquivos enviados
│   ├── outputs/            # Armazenamento de arquivos processados
│   ├── requirements.txt    # Dependências Python
│   └── main.py            # Aplicação FastAPI
│
├── app/                    # Frontend Next.js
│   ├── app/               # Páginas App Router
│   │   ├── upload/        # Interface de upload de arquivos
│   │   ├── chat/          # Interface de chat IA
│   │   ├── download/      # Interface de download de arquivos
│   │   └── api/           # Rotas API (proxy para backend)
│   ├── components/        # Componentes React
│   │   ├── layout/        # Componentes de layout
│   │   ├── upload/        # Componentes específicos de upload
│   │   ├── chat/          # Componentes específicos de chat
│   │   ├── download/      # Componentes específicos de download
│   │   └── ui/            # Componentes UI reutilizáveis
│   └── lib/               # Utilitários e configurações
│
└── README.md              # Este arquivo
```

## ✨ Funcionalidades Implementadas

### ✅ Funcionalidade Principal (Completa)

1. **Sistema de Upload de Arquivos**
   - Interface drag & drop com feedback visual
   - Validação de arquivos (somente .txt, máx 10MB)
   - Rastreamento de progresso e tratamento de erros
   - Armazenamento persistente de arquivos com IDs únicos

2. **API Backend**
   - Implementação completa em FastAPI
   - Endpoints de upload/download de arquivos
   - Endpoints de chat streaming
   - Processamento de arquivos com integração IA
   - Tratamento abrangente de erros
   - Configuração CORS para frontend

3. **Base da UI**
   - Design responsivo com Tailwind CSS
   - Biblioteca de componentes moderna (Shadcn UI)
   - Sistema de navegação e layout
   - Interface de upload com drag & drop
   - Interface de gerenciamento de download

4. **Integração IA**
   - Integração com API OpenRouter
   - Manipulação de resposta streaming
   - Análise de conteúdo de arquivo
   - Modelos de IA configuráveis

## 🛠️ TODO: Tarefas de Implementação para Candidatos

### 🎯 Tarefas Principais (Obrigatórias)

#### 1. **Implementação de Chat Streaming** ⭐⭐⭐
**Localização:** `app/components/chat/chat-interface.tsx`

**Estado Atual:** Shell básico de UI com funcionalidade placeholder

**Requisitos:**
- Implementar chat streaming em tempo real com o agente IA
- Conectar ao endpoint `/api/chat/stream/{conversationId}`
- Manipular Server-Sent Events ou respostas streaming
- Adicionar estados de carregamento adequados e indicadores de digitação
- Implementar gerenciamento de histórico de conversas
- Adicionar integração de contexto de arquivo (referenciar arquivos enviados)

**Detalhes Técnicos:**
```typescript
// Exemplo de implementação streaming necessária:
const handleSendMessage = async () => {
  const response = await fetch(`/api/chat/stream/${conversationId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: inputMessage, file_id: selectedFileId })
  })
  
  // Manipular resposta streaming...
}
```

#### 2. **Tratamento de Erros e Estados de Carregamento** ⭐⭐
**Localização:** Em toda a aplicação

**Requisitos:**
- Adicionar boundaries de erro abrangentes
- Implementar spinners de carregamento e estados skeleton
- Tratar falhas de rede graciosamente
- Adicionar mecanismos de retry para requests falhados
- Exibir mensagens de erro amigáveis ao usuário

#### 3. **Aprimoramento do Gerenciamento de Estado** ⭐⭐
**Localização:** Vários componentes

**Requisitos:**
- Implementar estado global para arquivos enviados
- Compartilhar contexto de arquivo entre páginas upload/chat/download
- Adicionar histórico de conversas persistente
- Gerenciar estados de carregamento em toda a aplicação

### 🚀 Tarefas Avançadas (Opcionais)

#### 4. **Melhorias no Chat**
- Formatação de mensagens com suporte markdown
- Destaque de sintaxe de código
- Previews de anexos de arquivo no chat
- Funcionalidade de exportar conversas
- Busca e filtragem de mensagens

#### 5. **Pipeline de Processamento de Arquivos**
- Processamento de arquivos em lote
- Instruções de processamento personalizadas
- Histórico de processamento e análises
- Capacidades de preview de arquivos

#### 6. **Otimizações de Performance**
- Implementar memoização adequada do React
- Adicionar lazy loading para componentes
- Otimizar tamanho do bundle
- Adicionar estratégias de cache

## 🧪 Diretrizes de Teste

### Executando a Aplicação

1. **Iniciar Backend:**
   ```bash
   cd backend && python main.py
   ```

2. **Iniciar Frontend:**
   ```bash
   cd app && yarn dev
   ```

3. **Testar Fluxo de Upload:**
   - Visite `http://localhost:3000/upload`
   - Envie um arquivo .txt
   - Anote o ID do arquivo retornado

4. **Testar Fluxo de Chat:**
   - Visite `http://localhost:3000/chat`
   - Implemente funcionalidade de chat streaming
   - Teste com e sem contexto de arquivo

5. **Testar Fluxo de Download:**
   - Visite `http://localhost:3000/download`
   - Processe arquivo enviado usando ID do arquivo
   - Baixe o resultado processado

### Endpoints da API Disponíveis

- `POST /api/upload/` - Enviar arquivo
- `POST /api/chat/stream/{conversationId}` - Chat streaming
- `POST /api/download/process` - Processar arquivo
- `GET /api/download/file/{filename}` - Baixar arquivo
- `GET /api/download/list` - Listar arquivos disponíveis

## 📋 Critérios de Avaliação

### Habilidades Técnicas (70%)
- **Qualidade do Código**: Código limpo, legível e manutenível
- **React/Next.js**: Padrões modernos e melhores práticas
- **TypeScript**: Implementação adequada de segurança de tipos
- **Integração de API**: Manipulação correta de respostas streaming
- **Tratamento de Erros**: Gerenciamento abrangente de erros
- **Gerenciamento de Estado**: Manipulação eficiente de estado

### Experiência do Usuário (20%)
- **Design da Interface**: UI intuitiva e responsiva
- **Estados de Carregamento**: Feedback adequado durante operações
- **Mensagens de Erro**: Comunicação de erro clara e acionável
- **Acessibilidade**: Considerações básicas de acessibilidade

### Resolução de Problemas (10%)
- **Organização do Código**: Estrutura lógica de arquivos e componentes
- **Documentação**: Comentários e documentação claros
- **Testes**: Implementação básica de testes
- **Performance**: Considerações de otimização

## 🔧 Dicas de Desenvolvimento

### Tecnologias Principais
- **Next.js 14**: App Router, Server Components, API Routes
- **React 18**: Hooks, Context, Streaming
- **TypeScript**: Tipagem forte em todo o projeto
- **Tailwind CSS**: Estilização utility-first
- **Shadcn UI**: Biblioteca de componentes pré-construídos
- **FastAPI**: Framework web Python moderno

### Armadilhas Comuns a Evitar
- Não misture Server e Client Components incorretamente
- Manipule estados de carregamento antes de implementar streaming
- Gerencie adequadamente o estado da conversa
- Não esqueça dos error boundaries
- Teste com uploads reais de arquivo

### Recursos Úteis
- [Documentação Next.js 14](https://nextjs.org/docs)
- [Recursos React 18](https://reactjs.org/blog/2022/03/29/react-v18.html)
- [Streaming no Next.js](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming)
- [Documentação API OpenRouter](https://openrouter.ai/docs)

## 🤝 Suporte

Se você encontrar problemas com a configuração base ou tiver dúvidas sobre os requisitos:

1. Verifique se todos os serviços estão executando corretamente
2. Verifique se as variáveis de ambiente estão configuradas
3. Teste endpoints do backend diretamente em `/docs`
4. Revise o código de exemplo nos componentes

## 📄 Licença

Este projeto é fornecido como está para fins de avaliação técnica.

---

**Boa Codificação! 🚀**

*Construa algo incrível e mostre suas habilidades!*
