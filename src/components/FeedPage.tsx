import { useState, useEffect } from "react";
import { ClipboardList, Filter, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Page } from "../App";
import { PageHeader } from "./PageHeader";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface FeedItem {
  id: number;
  callId: number;
  title: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: string;
  updatedAt: string;
  activity: string;
}

interface FeedPageProps {
  onNavigate: (page: Page) => void;
}

export function FeedPage({ onNavigate }: FeedPageProps) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Load feed items from localStorage on mount
  useEffect(() => {
    const loadFeedItems = () => {
      const calls = JSON.parse(localStorage.getItem("calls") || "[]");
      const comments = JSON.parse(localStorage.getItem("comments") || "[]");
      
      // Create feed items from calls
      const callFeed: FeedItem[] = calls.map((call: any) => ({
        id: call.id,
        callId: call.id,
        title: call.title,
        status: call.status,
        priority: call.priority,
        assignedTo: call.assignedTo,
        updatedAt: call.createdAt + " 09:00",
        activity: "Novo chamado criado"
      }));

      // Create feed items from comments
      const commentFeed: FeedItem[] = comments.map((comment: any, index: number) => ({
        id: 1000 + index,
        callId: comment.callId,
        title: comment.callTitle,
        status: "in_progress" as const,
        priority: "medium" as const,
        assignedTo: comment.author,
        updatedAt: comment.createdAt,
        activity: "Comentário adicionado"
      }));

      // Combine and sort by date
      const allFeed = [...callFeed, ...commentFeed].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setFeedItems(allFeed);
    };

    loadFeedItems();
    
    // Update feed when localStorage changes
    const handleStorageChange = () => {
      loadFeedItems();
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const filteredItems = filterStatus === "all" 
    ? feedItems 
    : feedItems.filter(item => item.status === filterStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="w-5 h-5 text-purple-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "resolved":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "closed":
        return <XCircle className="w-5 h-5 text-slate-600" />;
      default:
        return <Clock className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      open: { label: "Aberto", className: "bg-purple-100 text-purple-700" },
      in_progress: { label: "Em Andamento", className: "bg-blue-100 text-blue-700" },
      resolved: { label: "Resolvido", className: "bg-green-100 text-green-700" },
      closed: { label: "Fechado", className: "bg-slate-100 text-slate-700" }
    };
    return variants[status] || variants.open;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500";
      case "high":
        return "border-l-orange-500";
      case "medium":
        return "border-l-blue-500";
      case "low":
        return "border-l-slate-500";
      default:
        return "border-l-slate-500";
    }
  };

  return (
    <>
      <PageHeader
        title="Feed de Chamados"
        description="Acompanhe as atualizações dos chamados em tempo real"
        icon={ClipboardList}
        color="from-teal-500 to-teal-600"
        onNavigate={onNavigate}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <Filter className="w-5 h-5 text-slate-400" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as atualizações</SelectItem>
              <SelectItem value="open">Abertos</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="resolved">Resolvidos</SelectItem>
              <SelectItem value="closed">Fechados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Feed Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>

          {/* Feed Items */}
          <div className="space-y-6">
            {filteredItems.map((item) => {
              const statusBadge = getStatusBadge(item.status);
              
              return (
                <div key={item.id} className="relative pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-3 top-3 w-6 h-6 bg-white rounded-full border-4 border-teal-500 shadow-sm"></div>

                  {/* Card */}
                  <div className={`bg-white rounded-xl shadow-sm border-l-4 ${getPriorityColor(item.priority)} border-t border-r border-b border-slate-200 p-6 hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                          {getStatusIcon(item.status)}
                        </div>
                        <div>
                          <h3 className="text-slate-900">
                            #{item.callId} - {item.title}
                          </h3>
                          <p className="text-slate-600 text-sm mt-1">{item.activity}</p>
                        </div>
                      </div>
                      <Badge className={statusBadge.className}>
                        {statusBadge.label}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-xs">
                          {item.assignedTo.charAt(0).toUpperCase()}
                        </div>
                        <span>{item.assignedTo}</span>
                      </div>
                      <span className="text-slate-400 text-sm">
                        {new Date(item.updatedAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}