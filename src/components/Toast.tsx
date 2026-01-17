import React, { useEffect } from "react";
import { AlertCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 bg-neutral-900 border border-red-500/20 rounded-full shadow-2xl shadow-black/80 animate-fade-in backdrop-blur-md">
      <div className="p-1 rounded-full bg-red-500/10">
        <AlertCircle className="w-4 h-4 text-red-500" />
      </div>
      <span className="text-sm font-medium text-red-100/90 whitespace-nowrap">
        {message}
      </span>
      <button
        onClick={onClose}
        className="ml-2 p-1 hover:bg-white/5 rounded-full text-neutral-500 hover:text-white transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default Toast;
