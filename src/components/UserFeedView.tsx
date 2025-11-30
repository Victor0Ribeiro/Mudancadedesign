import { useLocalStorage } from "../hooks/useLocalStorage";
import { Clock, User, AlertCircle } from "lucide-react";

interface Call {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo: string;
  createdAt: string;
}

export function UserFeedView() {
  const [calls] = useLocalStorage<Call[]>("calls", []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in_progress":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "resolved":
        return "bg-green-100 text-green-700 border-green-200";
      case "closed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Aberto";
      case "in_progress":
        return "Em Andamento";
      case "resolved":
        return "Resolvido";
      case "closed":
        return "Fechado";
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low":
        return "Baixa";
      case "medium":
        return "Média";
      case "high":
        return "Alta";
      case "urgent":
        return "Urgente";
      default:
        return priority;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Sort by date (newest first)
  const sortedCalls = [...calls].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Feed de Chamados</h1>
        <p className="text-slate-600">Acompanhe o status dos chamados em tempo real</p>
      </div>

      {/* Calls Feed */}
      {calls.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-slate-900 mb-2">Nenhum chamado encontrado</h3>
          <p className="text-slate-600">Não há chamados cadastrados no sistema ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCalls.map((call) => (
            <div
              key={call.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-slate-900 mb-2">{call.title}</h3>
                  <p className="text-slate-600 line-clamp-2">{call.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(call.status)}`}>
                    {getStatusLabel(call.status)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm border ${getPriorityColor(call.priority)}`}>
                    {getPriorityLabel(call.priority)}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{call.assignedTo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(call.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
