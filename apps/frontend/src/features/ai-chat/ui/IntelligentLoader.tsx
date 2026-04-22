import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const loadingMessages = [
  "Đang đọc ngữ cảnh...",
  "Đang phân tích logic...",
  "Đang tìm kiếm thông tin...",
  "Đang viết câu trả lời...",
  "Đang tối ưu hóa...",
];

export function IntelligentLoader() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 px-1 py-0.5">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="text-indigo-400"
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>
      <div className="relative h-5 flex items-center overflow-hidden min-w-[150px]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-medium text-indigo-300 whitespace-nowrap"
          >
            {loadingMessages[messageIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
