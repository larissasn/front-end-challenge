
# Desafio Agent UI - Backend

🔧 **Backend FastAPI para Processamento de Arquivos com Agente IA**

Este backend fornece endpoints de API RESTful para upload de arquivos, processamento com IA e funcionalidade de chat streaming usando integração OpenRouter.

## 🚀 Início Rápido

### Instalação

```bash
# Instalar dependências
pip install -r requirements.txt

# Configurar ambiente
cp .env.example .env
# Editar .env com sua chave API OpenRouter

# Executar o servidor
python main.py
```

Servidor executa em: `http://localhost:8000`

## 📡 Endpoints da API

### Upload de Arquivo
- `POST /api/upload/` - Enviar arquivos .txt
- `GET /api/upload/status/{file_id}` - Verificar status do arquivo

### Chat & IA
- `POST /api/chat/start` - Iniciar nova conversa
- `POST /api/chat/stream/{conversation_id}` - Chat streaming
- `GET /api/chat/status` - Status do agente

### Processamento de Arquivo
- `POST /api/download/process` - Processar arquivo com IA
- `GET /api/download/file/{filename}` - Baixar arquivo processado
- `GET /api/download/list` - Listar arquivos disponíveis

### Sistema
- `GET /` - Informações da API
- `GET /health` - Verificação de saúde
- `GET /docs` - Documentação interativa da API

## 🧠 Recursos do Agente IA

### Processamento de Arquivo
- Resumo de conteúdo
- Extração de tópicos principais
- Geração de insights
- Instruções de processamento personalizadas

### Chat Streaming
- Respostas em tempo real
- Integração de contexto de arquivo
- Histórico de conversas
- Suporte a múltiplos modelos

## 📁 Estrutura de Diretórios

```
backend/
├── app/
│   ├── routes/          # Endpoints da API
│   ├── services/        # Lógica de negócio
│   ├── models.py        # Esquemas Pydantic
│   └── config.py        # Configuração
├── uploads/             # Armazenamento de arquivos
├── outputs/             # Arquivos processados
└── main.py             # Entrada da aplicação
```

## 🔧 Configuração

Variáveis de ambiente em `.env`:

```env
# Configuração OpenRouter
OPENROUTER_API_KEY=sua_chave_api_aqui
OPENROUTER_MODEL=anthropic/claude-3-haiku
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Configuração de Arquivo  
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_EXTENSIONS=.txt

# Configuração CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 🧪 Testes

```bash
# Testar endpoint de saúde
curl http://localhost:8000/health

# Enviar um arquivo
curl -X POST -F "file=@test.txt" http://localhost:8000/api/upload/

# Ver documentação da API
open http://localhost:8000/docs
```

## 🔒 Recursos de Segurança

- Validação de tipo de arquivo
- Limites de tamanho (10MB padrão)
- Sanitização de entrada
- Tratamento de erros
- Configuração CORS

---

Construído com FastAPI 🚀
