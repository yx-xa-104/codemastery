'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Copy, Code, Loader2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  codeSnippet?: string;
}

interface AiChatProps {
  lessonTitle?: string;
  onApplyCode?: (code: string) => void;
}

export default function AiChat({ lessonTitle, onApplyCode }: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Xin chào! Tôi là AI tutor của bạn. Tôi có thể giúp bạn${
        lessonTitle ? ` với bài học "${lessonTitle}"` : ' với các câu hỏi lập trình'
      }. Hãy hỏi tôi bất cứ điều gì!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for AI explain code event from CodeEditor
  useEffect(() => {
    const handleExplainCode = (event: CustomEvent) => {
      const { code, language } = event.detail;
      handleSendMessage(`Giải thích đoạn code ${language} này cho tôi:\n\`\`\`${language}\n${code}\n\`\`\``);
    };

    window.addEventListener('ai-explain-code', handleExplainCode as EventListener);
    return () => {
      window.removeEventListener('ai-explain-code', handleExplainCode as EventListener);
    };
  }, []);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `Đây là câu trả lời mô phỏng cho: "${content}". Trong thực tế, tôi sẽ kết nối với API AI để cung cấp câu trả lời thực sự!`,
        timestamp: new Date(),
        codeSnippet:
          content.toLowerCase().includes('code') || content.toLowerCase().includes('ví dụ')
            ? `# Đây là ví dụ code\nprint("Hello, World!")`
            : undefined,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleApplyToEditor = (code: string) => {
    onApplyCode?.(code);
    // You can also dispatch a custom event
    window.dispatchEvent(
      new CustomEvent('apply-code-to-editor', {
        detail: { code },
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-midnight-900">
      {/* Header */}
      <div className="glass-indigo border-b border-amber-700/30 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-white">AI Tutor</h3>
        </div>
        {lessonTitle && (
          <p className="text-xs text-gray-400 mt-1">Hỗ trợ: {lessonTitle}</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`${
                message.role === 'ai' ? 'message-ai' : 'message-user'
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

              {/* Code Snippet */}
              {message.codeSnippet && (
                <div className="mt-3 bg-black/40 rounded-lg p-3 border border-amber-600/20">
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    <code>{message.codeSnippet}</code>
                  </pre>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleCopyCode(message.codeSnippet!)}
                      className="flex items-center gap-1 px-2 py-1 bg-midnight-700 hover:bg-midnight-600 text-amber-500 rounded text-xs transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                    <button
                      onClick={() => handleApplyToEditor(message.codeSnippet!)}
                      className="flex items-center gap-1 px-2 py-1 bg-amber-800 hover:bg-amber-700 text-midnight-900 rounded text-xs font-bold transition-colors"
                    >
                      <Code className="w-3 h-3" />
                      Apply to Editor
                    </button>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="message-ai">
              <div className="typing-indicator flex gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-indigo-700/30 p-4 bg-midnight-800">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi AI về bài học..."
            className="flex-1 bg-midnight-700 text-gray-100 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-indigo-700/30"
            rows={2}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isTyping}
            className="btn-golden self-end disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
