
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

### 🔥 Tarefa Principal: Chat Streaming

**Arquivo:** `components/chat/chat-interface.tsx`

**Estado Atual:** Shell básico de UI com funcionalidade placeholder

**O que você precisa implementar:**

1. **Manipulação de Resposta Streaming**
   ```typescript
   // Conectar ao endpoint streaming
   const response = await fetch('/api/chat/stream/conversation-id', {
     method: 'POST', 
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ message: inputMessage, file_id: fileId })
   })

   // Manipular chunks streaming
   const reader = response.body.getReader()
   // Processar dados streaming...
   ```

2. **Atualizações de UI em Tempo Real**
   - Exibir mensagens conforme chegam via stream
   - Adicionar indicadores de digitação
   - Manipular histórico de conversas
   - Mostrar estados de carregamento

3. **Integração de Contexto de Arquivo**
   - Referenciar arquivos enviados no chat
   - Exibir informações do arquivo
   - Respostas conscientes do contexto

### 🎨 Melhorias de UI

- Boundaries de erro em toda a aplicação
- Skeletons de carregamento
- Notificações toast para ações
- Melhorias de design responsivo

### 📡 Gerenciamento de Estado

- Estado global para arquivos enviados
- Persistência de conversas
- Compartilhamento de dados entre páginas

## 🛠️ Componentes Disponíveis

### Componentes UI (Shadcn)
- `Button` - Vários estilos e tamanhos
- `Card` - Contêineres de conteúdo
- `Input` / `Textarea` - Entradas de formulário
- `Alert` - Notificações
- `Label` - Rótulos de formulário

### Componentes Personalizados
- `UploadInterface` - Sistema completo de upload de arquivo
- `ChatInterface` - UI de chat (precisa implementação)
- `DownloadInterface` - Processamento e download de arquivo
- `Header` - Navegação com design responsivo

## 📱 Recursos

### ✅ Implementado
- Upload responsivo de arquivo com drag & drop
- UI elegante com Tailwind CSS
- Navegação e roteamento
- Configuração de integração de API
- Gerenciamento de download
- Base de tratamento de erros

### 🚧 TODO (Suas Tarefas)
- Implementação de chat streaming
- Manipulação de mensagens em tempo real
- Gerenciamento de estado de conversa
- Boundaries de erro aprimorados
- Melhorias de estado de carregamento

## 🎨 Estilização

- **Tailwind CSS** - Estilização utility-first
- **Shadcn UI** - Componentes pré-construídos
- **Lucide Icons** - Ícones elegantes
- **Design Responsivo** - Abordagem mobile-first

## 🔧 Dicas de Desenvolvimento

### Melhores Práticas React/Next.js
- Use Server Components por padrão
- Adicione `'use client'` apenas quando necessário
- Implemente boundaries de erro adequados
- Manipule estados de carregamento graciosamente

### Gerenciamento de Estado
```typescript
// Exemplo de estrutura de estado necessária
interface AppState {
  uploadedFiles: UploadedFile[]
  conversations: Conversation[]
  currentFileId?: string
  isLoading: boolean
}
```

### Integração de API
```typescript
// Todas as rotas da API fazem proxy para o backend
'/api/upload' -> 'http://localhost:8000/api/upload'
'/api/chat/*' -> 'http://localhost:8000/api/chat/*'  
'/api/download/*' -> 'http://localhost:8000/api/download/*'
```

## 🧪 Testando Sua Implementação

1. **Fluxo de Upload**
   - Envie um arquivo .txt
   - Anote o ID do arquivo retornado
   - Verifique se o arquivo aparece no estado

2. **Fluxo de Chat** 
   - Inicie uma conversa
   - Envie mensagens
   - Verifique se o streaming funciona
   - Teste com contexto de arquivo

3. **Fluxo de Download**
   - Processe arquivos enviados
   - Baixe os resultados
   - Verifique o gerenciamento de arquivos

## 📋 Foco da Avaliação

- **Implementação de Streaming** (40%)
- **Gerenciamento de Estado** (25%) 
- **Tratamento de Erros** (20%)
- **Polimento UI/UX** (15%)

---

Construído com Next.js 14 ⚡
