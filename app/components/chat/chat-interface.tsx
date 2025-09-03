"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Bot, User, Send, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFileContext } from "@/app/context/FileContext";
import { toast } from "../ui/use-toast";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { selectedFileId } = useFileContext();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // rola até o final sempre que messages mudar
    container.scrollTop = container.scrollHeight;
  }, [messages]);
  //Chamar /chat/start para gerar conversationId
  useEffect(() => {
    const startConversation = async () => {
      try {
        const response = await fetch("/api/chat/start", { method: "POST" });
        if (!response.ok) throw new Error("Falha ao iniciar conversa");
        const data = await response.json();
        setConversationId(data.conversation_id);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Erro ao iniciar conversa",
          description: (error as Error).message || "Tente recarregar a página.",
        });
      }
    };
    startConversation();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Se já tem streaming rolando → aborta antes de iniciar outro
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    const botMessageId = (Date.now() + Math.random()).toString();
    let assistantMessage: Message = {
      id: botMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch(`/api/chat/stream/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          file_id: selectedFileId,
        }),
        signal: controller.signal, // <-- importante!
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let doneReading = false;
      while (!doneReading) {
        const { value, done } = await reader.read();
        doneReading = done;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });

          assistantMessage = {
            ...assistantMessage,
            content: assistantMessage.content + chunk,
          };

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: assistantMessage.content }
                : m
            )
          );
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Streaming aborted pelo usuário");
      } else {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Erro no streaming",
          description: error.message || "A conexão foi interrompida.",
        });
      }
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString();
  };

  // Função para carregar histórico salvo
  const loadMessages = (id: string): Message[] => {
    const raw = localStorage.getItem(`chat-history-${id}`);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp), // reconverte string -> Date
      }));
    } catch {
      return [];
    }
  };

  // Função para salvar histórico
  const saveMessages = (id: string, msgs: Message[]) => {
    localStorage.setItem(`chat-history-${id}`, JSON.stringify(msgs));
  };

  // Carregar quando conversationId mudar
  useEffect(() => {
    if (conversationId) {
      const stored = loadMessages(conversationId);
      if (stored.length > 0) {
        setMessages(stored);
      }
    }
  }, [conversationId]);

  // Salvar sempre que mensagens mudarem
  useEffect(() => {
    if (conversationId) {
      saveMessages(conversationId, messages);
    }
  }, [messages, conversationId]);

  return (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <MessageSquare className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          Envie uma mensagem para começar a conversar com a IA. Se você carregou
          um arquivo, as respostas podem usar esse contexto.
        </AlertDescription>
      </Alert>
      {/* Exibir arquivo carregado */}
      {selectedFileId && (
        <div className="text-sm text-muted-foreground">
          📎 Respondendo sobre: {selectedFileId}
        </div>
      )}
      {/* Chat Container */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            AI Agent Chat
          </CardTitle>
          <CardDescription>
            Ask questions about your uploaded files or general topics
          </CardDescription>
        </CardHeader>

        {/* Messages Area */}
        <CardContent
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Bot className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Start a conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Send a message to begin chatting with the AI agent
                  </p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] space-y-1 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground px-1">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3 justify-end">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="bg-muted px-4 py-2 rounded-lg">Digitando...</div>
            </div>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <CardContent className="border-blue-200 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-200 space-y-3 text-sm p-4 rounded-md">
        <div>
          <h4 className="font-medium mb-2">
            ✅ Funcionalidades Implementadas:
          </h4>
          <ul className="space-y-1 pl-4 list-disc">
            <li>
              Conectado a <code>/api/chat/start</code> para iniciar uma conversa
              e obter o ID da conversa.
            </li>
            <li>
              Conectado a <code>/api/chat/stream/{"{conversationId}"}</code>{" "}
              para receber respostas da IA em tempo real.
            </li>
            <li>
              Gerenciamento do estado da conversa usando React{" "}
              <code>useState</code> e <code>localStorage</code>.
            </li>
            <li>
              Suporte a contexto de arquivos via <code>FileContext</code> para
              respostas mais relevantes quando um arquivo é selecionado.
            </li>
            <li>
              Abortar streams em andamento se uma nova mensagem for enviada
              antes de terminar a anterior.
            </li>
            <li>
              Formatação das mensagens da IA com <code>ReactMarkdown</code> e{" "}
              <code>rehype-highlight</code> para código e texto enriquecido.
            </li>
            <li>
              Indicador de digitação ("Digitando...") enquanto a IA está
              respondendo.
            </li>
            <li>
              Tratamento de erros com notificações amigáveis via{" "}
              <code>toast</code>.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">💡 Sugestões de Melhoria:</h4>
          <ul className="space-y-1 pl-4 list-disc">
            <li>
              Permitir exportar o histórico da conversa em JSON ou arquivo de
              texto.
            </li>
            <li>
              Adicionar opção para deletar ou limpar o histórico de cada
              conversa.
            </li>
            <li>
              Melhorar a interface para responsividade em mobile e transições
              entre modo claro/escuro.
            </li>
            <li>
              Adicionar mecanismo de retry caso a requisição de streaming falhe.
            </li>
            <li>
              Incluir avatares para arquivos carregados ou referências de
              contexto.
            </li>
            <li>
              Opcional: Sugestões automáticas de perguntas baseadas no conteúdo
              do arquivo carregado.
            </li>
          </ul>
        </div>
      </CardContent>
    </div>
  );
}
