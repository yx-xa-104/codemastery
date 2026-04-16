import { useState, useCallback, useRef, useEffect } from 'react';

export type Role = 'user' | 'assistant';
export interface Message {
  id: string;
  role: Role;
  content: string;
}

export interface AiSession {
  id: string;
  title: string;
  created_at: string;
}

export function useAiChat(initialMessage?: Message) {
  const [messages, setMessages] = useState<Message[]>(initialMessage ? [initialMessage] : [
    {
      id: 'greeting',
      role: 'assistant',
      content: 'Xin chào! Tôi là PicoClaw AI Tutor của CodeMastery. Bạn cần giúp gì về lập trình hôm nay?'
    }
  ]);
  const [sessions, setSessions] = useState<AiSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchSessions = useCallback(async (userId: string) => {
    setIsSessionsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/picoclaw/sessions?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setSessions(data.data || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSessionsLoading(false);
    }
  }, [baseUrl]);

  const loadSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/picoclaw/sessions/${sessionId}/messages`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          const loadedMessages = data.data.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content
          }));
          setMessages(loadedMessages);
          setCurrentSessionId(sessionId);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await fetch(`${baseUrl}/api/picoclaw/sessions/${sessionId}`, { method: 'DELETE' });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        clearMessages();
      }
    } catch (err) {
      console.error(err);
    }
  }, [baseUrl, currentSessionId]);

  const sendMessage = useCallback(async (prompt: string, userId: string = 'anonymous') => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: prompt };
    
    let isLimitReached = false;
    if (userId === 'anonymous' && typeof window !== 'undefined') {
      const currentCount = parseInt(window.localStorage.getItem('anon_chat_count') || '0', 10);
      if (currentCount >= 5) {
        isLimitReached = true;
      } else {
        window.localStorage.setItem('anon_chat_count', (currentCount + 1).toString());
      }
    }

    setMessages((prev) => [...prev, userMessage]);

    if (isLimitReached) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, bạn đã đạt giới hạn 5 câu hỏi miễn phí. Vui lòng **đăng nhập** để tiếp tục sử dụng AI Tutor không giới hạn nhé!',
      }]);
      return;
    }

    setIsLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const bodyParams: any = { user_id: userId, prompt };
      if (currentSessionId) bodyParams.session_id = currentSessionId;

      if (typeof window !== 'undefined') {
        bodyParams.metadata = {
          path: window.location.pathname,
          code: window.localStorage.getItem('codemastery_active_code') || ''
        };
      }

      const response = await fetch(`${baseUrl}/api/picoclaw/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyParams),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`Failed to send message: ${response.statusText}`);

      const data = await response.json();
      const reply = data.reply || 'Xin lỗi, tôi không thể xử lý yêu cầu lúc này.';
      
      if (data.session_id && !currentSessionId) {
        setCurrentSessionId(data.session_id);
        // Refresh sessions to show the new one
        fetchSessions(userId);
      }

      setMessages((prev) => [...prev, {
        id: assistantMsgId,
        role: 'assistant',
        content: reply,
      }]);

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setMessages((prev) => [...prev, {
          id: assistantMsgId,
          role: 'assistant',
          content: '*(Lỗi: Rất tiếc, đã có lỗi khi lấy phản hồi. Vui lòng thử lại sau!)*',
        }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, currentSessionId, baseUrl, fetchSessions]);

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
    setCurrentSessionId(null);
    setMessages(initialMessage ? [initialMessage] : [
      {
        id: 'greeting',
        role: 'assistant',
        content: 'Xin chào! Tôi là PicoClaw AI Tutor của CodeMastery. Bạn cần giúp gì về lập trình hôm nay?'
      }
    ]);
    setIsLoading(false);
  }, [initialMessage]);

  return { 
    messages, 
    isLoading, 
    sendMessage, 
    abortStream, 
    clearMessages,
    sessions,
    isSessionsLoading,
    currentSessionId,
    fetchSessions,
    loadSession,
    deleteSession
  };
}
