import { useState } from "react";
import { DashboardCard } from "./DashboardCard";
import { Users, Settings, MessageSquare, ClipboardList, BarChart3 } from "lucide-react";
import { Page } from "../App";
import { CreditsModal } from "./CreditsModal";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const cards = [
    {
      id: 1,
      title: "Usuários",
      description: "Painel contendo informações dos usuários do sistema, incluindo dados, permissões e contatos principais",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      page: "usuarios" as Page
    },
    {
      id: 2,
      title: "Chamados",
      description: "Tabela contendo os registros dos chamados abertos na plataforma atualmente",
      icon: Settings,
      color: "from-purple-500 to-purple-600",
      page: "chamados" as Page
    },
    {
      id: 3,
      title: "Comentários de Chamados",
      description: "Seção contendo os comentários feitos nos chamados pelos usuários responsáveis",
      icon: MessageSquare,
      color: "from-pink-500 to-pink-600",
      page: "comentarios" as Page
    },
    {
      id: 4,
      title: "Feed de Chamados",
      description: "Seção para visualizar chamados em andamento e concluídos, permitindo acompanhamento rápido do status dos chamados",
      icon: ClipboardList,
      color: "from-teal-500 to-teal-600",
      page: "feed" as Page
    },
    {
      id: 5,
      title: "Feedbacks",
      description: "Tabela para registro de feedbacks gerais dos usuários sobre a plataforma",
      icon: BarChart3,
      color: "from-orange-500 to-orange-600",
      page: "feedbacks" as Page
    }
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-slate-900">Seja bem-vindo(a)</h1>
              <p className="text-slate-600 mt-1">Gerencie seu sistema de chamados de forma eficiente</p>
              <p className="text-slate-200 mt-1">feito por Victor Ribeiro</p>
            </div>
            <button
              onClick={() => setIsCreditsOpen(true)}
              className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 cursor-pointer shadow-md hover:shadow-lg"
              aria-label="Ver créditos do projeto"
            >
              <Users className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <DashboardCard key={card.id} {...card} onClick={() => onNavigate(card.page)} />
          ))}
        </div>
      </main>

      {/* Credits Modal */}
      <CreditsModal isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />
    </>
  );
}
