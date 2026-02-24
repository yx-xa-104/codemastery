'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Copy, Code, Loader2 } from 'lucide-react';

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
      content: `Xin chào! Tôi là trợ lý lập trình CodeMastery.\nHôm nay chúng ta tìm hiểu về ${lessonTitle ? `**${lessonTitle}**` : 'bài học này'} nhé.`,
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'ai',
      content: 'Bạn có thể hỏi tôi bất cứ điều gì về bài học, hoặc nhờ tôi giải thích một đoạn code!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleExplainCode = (event: CustomEvent) => {
      const { code, language } = event.detail;
      handleSendMessage(`Giải thích đoạn code ${language} này cho tôi:\n\`\`\`${language}\n${code}\n\`\`\``);
    };
    window.addEventListener('ai-explain-code', handleExplainCode as EventListener);
    return () => window.removeEventListener('ai-explain-code', handleExplainCode as EventListener);
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

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `Câu hỏi hay! Đây là câu trả lời cho: "${content.substring(0, 50)}..."`,
        timestamp: new Date(),
        codeSnippet:
          content.toLowerCase().includes('code') || content.toLowerCase().includes('ví dụ')
            ? `# Ví dụ minh họa\nprint("Hello, World!")`
            : undefined,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-navy-800">
      {/* Header */}
      <div className="p-4 border-b border-navy-700 bg-navy-800 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg">
              <span className="material-symbols-outlined text-white text-xl">psychology</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-navy-800 rounded-full"></div>
          </div>
          <div>
            <h2 className="font-bold text-white text-sm">Gia sư AI</h2>
            <div className="text-xs text-indigo-300">Đang trực tuyến</div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-navy-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md ${
                message.role === 'ai'
                  ? 'bg-indigo-600'
                  : 'bg-navy-700 border border-accent-gold/50'
              }`}
            >
              {message.role === 'ai' ? (
                <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
              ) : (
                <span className="text-accent-gold text-xs font-bold">VN</span>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`p-3.5 rounded-2xl shadow-lg max-w-[88%] text-sm ${
                message.role === 'ai'
                  ? 'bg-indigo-600 text-white rounded-tl-none border border-indigo-500'
                  : 'bg-navy-950 text-slate-200 rounded-tr-none border border-accent-gold/30'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>

              {message.codeSnippet && (
                <div className="mt-3 bg-navy-950 rounded p-2.5 border-l-2 border-accent-gold shadow-inner">
                  <pre className="text-xs font-mono text-indigo-300 overflow-x-auto">
                    <code>{message.codeSnippet}</code>
                  </pre>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(message.codeSnippet!)}
                      className="flex items-center gap-1 text-xs bg-indigo-800 hover:bg-indigo-700 text-indigo-100 px-2 py-1 rounded transition-colors border border-indigo-500/30"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                    <button
                      onClick={() => onApplyCode?.(message.codeSnippet!)}
                      className="flex items-center gap-1 text-xs bg-accent-gold hover:bg-accent-gold-hover text-navy-950 font-bold px-2 py-1 rounded transition-colors"
                    >
                      <Code className="w-3 h-3" /> Áp dụng
                    </button>
                  </div>
                </div>
              )}

              <p className="text-[10px] mt-1.5 opacity-60">
                {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
            </div>
            <div className="bg-indigo-600 p-3.5 rounded-2xl rounded-tl-none border border-indigo-500 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce [animation-delay:0ms]"></span>
              <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce [animation-delay:300ms]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-navy-800 border-t border-navy-700 flex-shrink-0">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi về đoạn mã..."
            className="w-full bg-navy-950 text-white border border-navy-600 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition-all shadow-inner outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white transition-all shadow-lg"
          >
            {isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="mt-2 flex justify-center items-center gap-1 opacity-50">
          <span className="material-symbols-outlined text-[10px] text-accent-gold">bolt</span>
          <span className="text-[10px] text-slate-400">Được hỗ trợ bởi CodeMastery AI v2.0</span>
        </div>
      </div>
    </div>
  );
}
