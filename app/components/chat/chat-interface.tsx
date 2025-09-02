"use client";

import React, { useState } from "react";
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
  const { selectedFileId } = useFileContext();

  // TODO: Implement actual chat functionality
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // TODO: Replace with actual API call to streaming endpoint
    // Example implementation needed:

    try {
      const response = await fetch(`/api/chat/stream/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          file_id: selectedFileId,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        assistantMessage.content += chunk;
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== assistantMessage.id),
          assistantMessage,
        ]);
      }
    } catch (error) {
      console.error(error);
      // Aqui você pode adicionar um toast ou alert
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Implementation Notice */}
      <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          <strong>TODO:</strong> This chat interface needs to be implemented.
          Key features to add: streaming responses, conversation management,
          file context integration.
        </AlertDescription>
      </Alert>

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
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    {message.content}
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
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
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
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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

      {/* Development Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">
            🛠️ Implementation Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 dark:text-blue-300 space-y-3 text-sm">
          <div>
            <h4 className="font-medium mb-2">Required API Integration:</h4>
            <ul className="space-y-1 pl-4">
              <li>
                • Connect to <code>/api/chat/stream/{`{conversationId}`}</code>
              </li>
              <li>• Handle streaming responses with Server-Sent Events</li>
              <li>• Implement conversation state management</li>
              <li>• Add file context integration</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">UI Enhancements:</h4>
            <ul className="space-y-1 pl-4">
              <li>• Add typing indicators and loading states</li>
              <li>• Implement message formatting and code highlighting</li>
              <li>• Add conversation history and export features</li>
              <li>• Include error handling and retry mechanisms</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
