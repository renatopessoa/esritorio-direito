import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function ErrorPopup({ message, onClose, duration = 5000 }: ErrorPopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
      <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md">
        <p className="flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-red-600 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}