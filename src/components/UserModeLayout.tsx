import { useState } from "react";
import { MessageSquare, Send, Eye, MessageCircle, Star } from "lucide-react";

interface UserModeLayoutProps {
  onNavigate: (section: "new-call" | "feed" | "comments" | "feedback") => void;
  currentSection: "new-call" | "feed" | "comments" | "feedback";
}

export function UserModeLayout({ onNavigate, currentSection }: UserModeLayoutProps) {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          <button
            onClick={() => onNavigate("new-call")}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
              currentSection === "new-call"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <Send className="w-5 h-5" />
            Abrir Chamado
          </button>
          
          <button
            onClick={() => onNavigate("feed")}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
              currentSection === "feed"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <Eye className="w-5 h-5" />
            Ver Chamados
          </button>
          
          <button
            onClick={() => onNavigate("comments")}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
              currentSection === "comments"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            Comentar
          </button>
          
          <button
            onClick={() => onNavigate("feedback")}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
              currentSection === "feedback"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <Star className="w-5 h-5" />
            Dar Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
