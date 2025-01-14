import React from 'react';
import { Bell } from 'lucide-react';

interface LegalNewsItemProps {
  title: string;
  date: string;
  content: string;
  onClick?: () => void;
}

export function LegalNewsItem({
  title,
  date,
  content,
  onClick
}: LegalNewsItemProps) {
  return (
    <div 
      className="p-4 glass-card rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
          <Bell className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-white">{title}</h4>
            <span className="text-sm text-gray-400">{date}</span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{content}</p>
        </div>
      </div>
    </div>
  );
}