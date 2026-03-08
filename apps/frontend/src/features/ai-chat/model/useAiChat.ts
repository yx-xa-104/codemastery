import { useState, useCallback, useRef, useEffect } from 'react';

export type Role = 'user' | 'assistant';
export interface Message {
  id: string;
  role: Role;
  content: string;
}

export function useAiChat(initialMessage?: Message) {
  const [messages, setMessages] = useState<Message[]>(initialMessage ? [initialMessage] : [
    {
      id: 'greeting',
      role: 'assistant',
      content: 'Xin chào! Tôi là PicoClaw AI Tutor của CodeMastery. Bạn cần giúp gì về lập trình hôm nay?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (prompt: string, userId: string = 'anonymous') => {
    if (!prompt.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/picoclaw/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, prompt }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete lines in the buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6).trim();
            if (dataStr === '[DONE]') {
              continue; // End of stream
            }

            try {
              const data = JSON.parse(dataStr);
              const contentchunk = typeof data === 'string' ? data : (data.content || data.data?.content || '');

              if (contentchunk) {
                setMessages((prev) => prev.map((msg) =>
                  msg.id === assistantMsgId ? { ...msg, content: msg.content + contentchunk } : msg
                ));
              }
            } catch (e) {
              console.warn('Failed to parse SSE JSON chunk:', dataStr);
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer.trim()) {
        const trimmed = buffer.trim();
        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6).trim();
          try {
             if (dataStr !== '[DONE]') {
                const data = JSON.parse(dataStr);
                const contentchunk = typeof data === 'string' ? data : (data.content || data.data?.content || '');
                if (contentchunk) {
                  setMessages((prev) => prev.map((msg) =>
                    msg.id === assistantMsgId ? { ...msg, content: msg.content + contentchunk } : msg
                  ));
                }
             }
          } catch(e) {}
        }
      }

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setMessages((prev) => prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, content: msg.content + '\n\n*(Lỗi: Rất tiếc, đã có lỗi khi lấy phản hồi. Vui lòng thử lại sau!)*' } : msg
        ));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const abortStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearMessages = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages(initialMessage ? [initialMessage] : [
      {
        id: 'greeting',
        role: 'assistant',
        content: 'Xin chào! Tôi là PicoClaw AI Tutor của CodeMastery. Bạn cần giúp gì về lập trình hôm nay?'
      }
    ]);
    setIsLoading(false);
  }, [initialMessage]);

  return { messages, isLoading, sendMessage, abortStream, clearMessages };
}
