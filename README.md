# Desafio Agent UI - Frontend

⚡ **Frontend Next.js 14 com Interface de Chat IA**

Aplicação React moderna com funcionalidades de upload de arquivos, chat streaming e gerenciamento de download com componentes UI elegantes.

## 🚀 Início Rápido

```bash
# Instalar dependências
yarn install

# Iniciar servidor de desenvolvimento
yarn dev

# Construir para produção
yarn build
```

App executa em: `http://localhost:3000`

Configuração do Backend

# Navegar para o diretório backend

cd backend

# Instalar dependências Python

pip install -r requirements.txt
python -m venv venv -Esse comando cria uma pasta chamada venv no seu projeto.

# venv\Scripts\activate - Esse comando pra ativa o ambiente virtual.

# Configurar variáveis de ambiente

cp .env.example .env

# Editar .env com sua chave API OpenRouter

# Iniciar o servidor FastAPI

python main.py
O backend estará disponível em http://localhost:8000

Documentação da API: http://localhost:8000/docs
Verificação de Saúde: http://localhost:8000/health 2. Configuração do Frontend

# Navegar para o diretório frontend

cd app

# Instalar dependências Node.js

yarn install

# Iniciar o servidor de desenvolvimento

yarn dev
O frontend estará disponível em http://localhost:3000

3. Configuração
   Chave API OpenRouter (Necessária para recursos de IA)
   Registre-se em OpenRouter
   Obtenha sua chave API
   Adicione-a ao backend/.env:
   OPENROUTER_API_KEY=sua_chave_aqui
   Variáveis de Ambiente
   Backend (backend/.env):

OPENROUTER_API_KEY=sua_chave_api_openrouter_aqui
OPENROUTER_MODEL=anthropic/claude-3-haiku
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
AGENT_NAME=FileProcessorAgent
MAX_FILE_SIZE_MB=10
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
Frontend (app/.env):

BACKEND_URL=http://localhost:8000

## 🏗️ Arquitetura

### Páginas

- `/` - Homepage com visão geral dos recursos
- `/upload` - Interface de upload de arquivos
- `/chat` - Interface de chat IA (TODO: Implementação necessária)
- `/download` - Processamento e download de arquivos

### Estrutura de Componentes

```
components/
├── layout/          # Cabeçalho, navegação
├── upload/          # Componentes de upload de arquivo
├── chat/            # Componentes de interface de chat
├── download/        # Gerenciamento de download
└── ui/              # Componentes UI reutilizáveis
```

## 🎯 TODO: Tarefas de Implementação

### 🔥 Tarefa Implementada: Chat Streaming

1. **Manipulação de Resposta Streaming**

2. **Atualizações de UI em Tempo Real**

   - Exibir mensagens conforme chegam via stream
   - Adicionar indicadores de digitação
   - Manipular histórico de conversas
   - Mostrar estados de carregamento

3. **Integração de Contexto de Arquivo**
   - Referenciar arquivos enviados no chat
   - Exibir informações do arquivo
   - Respostas conscientes do contexto

### Componentes UI (Shadcn)

- `Button` - Vários estilos e tamanhos
- `Card` - Contêineres de conteúdo
- `Input` / `Textarea` - Entradas de formulário
- `Alert` - Notificações
- `Label` - Rótulos de formulário

## 🎨 Estilização

- **Tailwind CSS** - Estilização utility-first
- **Shadcn UI** - Componentes pré-construídos
- **Lucide Icons** - Ícones elegantes
- **Design Responsivo** - Abordagem mobile-first

Construído com Next.js 14 ⚡
