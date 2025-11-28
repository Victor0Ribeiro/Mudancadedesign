import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { UsersPage } from "./components/UsersPage";
import { CallsPage } from "./components/CallsPage";
import { CommentsPage } from "./components/CommentsPage";
import { FeedPage } from "./components/FeedPage";
import { FeedbacksPage } from "./components/FeedbacksPage";

export type Page = "dashboard" | "usuarios" | "chamados" | "comentarios" | "feed" | "feedbacks";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const renderPage = () => {
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

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">{renderPage()}</div>;
}
