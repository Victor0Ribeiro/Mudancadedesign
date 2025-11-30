import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { UsersPage } from "./components/UsersPage";
import { CallsPage } from "./components/CallsPage";
import { CommentsPage } from "./components/CommentsPage";
import { FeedPage } from "./components/FeedPage";
import { FeedbacksPage } from "./components/FeedbacksPage";
import { UserModeLayout } from "./components/UserModeLayout";
import { UserNewCall } from "./components/UserNewCall";
import { UserFeedView } from "./components/UserFeedView";
import { UserCommentsView } from "./components/UserCommentsView";
import { UserFeedbackView } from "./components/UserFeedbackView";
import { Code2, User } from "lucide-react";

export type Page = "dashboard" | "usuarios" | "chamados" | "comentarios" | "feed" | "feedbacks";
export type UserSection = "new-call" | "feed" | "comments" | "feedback";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [userSection, setUserSection] = useState<UserSection>("new-call");
  const [isDevMode, setIsDevMode] = useState(true);

  const renderDeveloperMode = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "usuarios":
        return <UsersPage onNavigate={setCurrentPage} />;
      case "chamados":
        return <CallsPage onNavigate={setCurrentPage} />;
      case "comentarios":
        return <CommentsPage onNavigate={setCurrentPage} />;
      case "feed":
        return <FeedPage onNavigate={setCurrentPage} />;
      case "feedbacks":
        return <FeedbacksPage onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  const renderUserSection = () => {
    switch (userSection) {
      case "new-call":
        return <UserNewCall />;
      case "feed":
        return <UserFeedView />;
      case "comments":
        return <UserCommentsView />;
      case "feedback":
        return <UserFeedbackView />;
      default:
        return <UserNewCall />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mode Switch Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-slate-900">Sistema de Chamados</h2>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex items-center gap-4">
              <span className={`text-sm transition-colors ${!isDevMode ? "text-slate-900" : "text-slate-500"}`}>
                Usuário
              </span>
              <button
                onClick={() => setIsDevMode(!isDevMode)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  isDevMode ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-blue-500 to-teal-500"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform flex items-center justify-center ${
                    isDevMode ? "translate-x-7" : "translate-x-0"
                  }`}
                >
                  {isDevMode ? (
                    <Code2 className="w-3 h-3 text-purple-600" />
                  ) : (
                    <User className="w-3 h-3 text-blue-600" />
                  )}
                </span>
              </button>
              <span className={`text-sm transition-colors ${isDevMode ? "text-slate-900" : "text-slate-500"}`}>
                Desenvolvedor
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {isDevMode ? (
        renderDeveloperMode()
      ) : (
        <>
          <UserModeLayout onNavigate={setUserSection} currentSection={userSection} />
          {renderUserSection()}
        </>
      )}
    </div>
  );
}
