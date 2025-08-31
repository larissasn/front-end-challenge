
import httpx
import json
from typing import List, Dict, Any, Optional, AsyncGenerator
from datetime import datetime
from ..config import settings
from ..models import ChatMessage

class AgentService:
    def __init__(self):
        self.client = httpx.AsyncClient(
            base_url=settings.openrouter_base_url,
            headers={
                "Authorization": f"Bearer {settings.openrouter_api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Agent UI Challenge"
            }
        )
        self.conversation_history: Dict[str, List[ChatMessage]] = {}
    
    async def process_file_content(self, content: str, instructions: str = None) -> str:
        """Process file content using the AI agent"""
        try:
            system_prompt = f"""
            You are {settings.agent_name}, {settings.agent_description}.
            
            Your task is to analyze the provided text content and provide a structured analysis.
            
            Please provide:
            1. A summary of the content
            2. Key topics or themes identified
            3. Important insights or findings
            4. Suggested actions or next steps (if applicable)
            
            Format your response in a clear, structured manner.
            """
            
            user_message = f"""
            Please analyze the following text content:
            
            {content}
            
            {f'Additional instructions: {instructions}' if instructions else ''}
            """
            
            response = await self.client.post(
                "/chat/completions",
                json={
                    "model": settings.openrouter_model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    "max_tokens": 1000,
                    "temperature": 0.7
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            else:
                return f"Error processing content: {response.text}"
                
        except Exception as e:
            return f"Error in agent processing: {str(e)}"
    
    async def chat_stream(
        self, 
        message: str, 
        conversation_id: str,
        file_content: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """Stream chat response from the AI agent"""
        try:
            # Get or create conversation history
            if conversation_id not in self.conversation_history:
                self.conversation_history[conversation_id] = []
            
            history = self.conversation_history[conversation_id]
            
            # Build messages array
            messages = [
                {
                    "role": "system", 
                    "content": f"""You are {settings.agent_name}, {settings.agent_description}.
                    
                    You can help users understand and analyze text files. Be helpful, accurate, and concise.
                    {'Current file context available for reference.' if file_content else 'No file currently loaded.'}
                    """
                }
            ]
            
            # Add conversation history
            for hist_msg in history:
                messages.append({
                    "role": hist_msg.role,
                    "content": hist_msg.content
                })
            
            # Add current message with file context if available
            current_message = message
            if file_content:
                current_message = f"""User message: {message}
                
                File content for reference:
                {file_content[:2000]}{'...' if len(file_content) > 2000 else ''}"""
            
            messages.append({"role": "user", "content": current_message})
            
            # Make streaming request
            async with self.client.stream(
                "POST",
                "/chat/completions",
                json={
                    "model": settings.openrouter_model,
                    "messages": messages,
                    "max_tokens": 1000,
                    "temperature": 0.7,
                    "stream": True
                }
            ) as response:
                if response.status_code != 200:
                    yield f"Error: {response.text}"
                    return
                
                full_response = ""
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]  # Remove "data: " prefix
                        if data == "[DONE]":
                            break
                        
                        try:
                            parsed = json.loads(data)
                            if "choices" in parsed and parsed["choices"]:
                                delta = parsed["choices"][0].get("delta", {})
                                if "content" in delta:
                                    content_chunk = delta["content"]
                                    full_response += content_chunk
                                    yield content_chunk
                        except json.JSONDecodeError:
                            continue
                
                # Store conversation history
                history.append(ChatMessage(role="user", content=message, timestamp=datetime.now()))
                history.append(ChatMessage(role="assistant", content=full_response, timestamp=datetime.now()))
                
                # Keep only last 10 messages to manage memory
                if len(history) > 10:
                    history = history[-10:]
                    self.conversation_history[conversation_id] = history
                    
        except Exception as e:
            yield f"Error in chat: {str(e)}"
    
    def get_status(self) -> Dict[str, Any]:
        """Get agent status"""
        return {
            "agent_name": settings.agent_name,
            "status": "online" if settings.openrouter_api_key else "offline",
            "model": settings.openrouter_model,
            "available": bool(settings.openrouter_api_key),
            "last_used": datetime.now() if settings.openrouter_api_key else None
        }

agent_service = AgentService()
