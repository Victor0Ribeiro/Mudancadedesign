import { useState } from "react";
import { ArrowLeft, LucideIcon, User } from "lucide-react";
import { Page } from "../App";
import { Button } from "./ui/button";
import { CreditsModal } from "./CreditsModal";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onNavigate: (page: Page) => void;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, color, onNavigate, action }: PageHeaderProps) {
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate("dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-slate-900">{title}</h1>
              <p className="text-slate-600 mt-1">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {action}
            <button
              onClick={() => setIsCreditsOpen(true)}
              className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 cursor-pointer shadow-md hover:shadow-lg"
              aria-label="Ver créditos do projeto"
            >
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Credits Modal */}
      <CreditsModal isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />
    </header>
  );
}
