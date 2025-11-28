import { useState } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { Page } from "../App";
import { PageHeader } from "./PageHeader";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Badge } from "./ui/badge";

interface Comment {
  id: number;
  callId: number;
  callTitle: string;
  author: string;
  content: string;
  createdAt: string;
}

interface Call {
  id: number;
  title: string;
  status: string;
  priority: string;
}

interface CommentsPageProps {
  onNavigate: (page: Page) => void;
}

export function CommentsPage({ onNavigate }: CommentsPageProps) {
  const [comments, setComments] = useLocalStorage<Comment[]>("comments", [
    { id: 1, callId: 1, callTitle: "Sistema de login não funciona", author: "Maria Santos", content: "Identifiquei o problema. É um erro no servidor de autenticação.", createdAt: "2024-01-20 14:30" },
    { id: 2, callId: 1, callTitle: "Sistema de login não funciona", author: "João Silva", content: "Preciso de mais informações sobre o ambiente onde está ocorrendo.", createdAt: "2024-01-20 15:45" },
    { id: 3, callId: 2, callTitle: "Relatório de vendas com erro", author: "Pedro Costa", content: "Já estou trabalhando nisso. Deve estar pronto até amanhã.", createdAt: "2024-01-21 09:15" },
    { id: 4, callId: 3, callTitle: "Solicitação de nova funcionalidade", author: "Ana Paula", content: "Essa funcionalidade vai agregar muito valor ao sistema!", createdAt: "2024-01-22 11:20" },
  ]);

  // Load calls from localStorage
  const [calls] = useLocalStorage<Call[]>("calls", []);

  const [selectedCall, setSelectedCall] = useState<string>("all");
  const [newComment, setNewComment] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const filteredComments = selectedCall === "all" 
    ? comments 
    : comments.filter(c => c.callId.toString() === selectedCall);

  const handleAddComment = () => {
    if (newComment.trim() && newAuthor.trim() && selectedCall !== "all") {
      const call = calls.find(c => c.id.toString() === selectedCall);
      if (!call) return;

      const newCommentObj: Comment = {
        id: Math.max(...comments.map(c => c.id), 0) + 1,
        callId: parseInt(selectedCall),
        callTitle: call.title,
        author: newAuthor,
        content: newComment,
        createdAt: new Date().toLocaleString('pt-BR')
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
      setNewAuthor("");
    }
  };

  const getStatusBadge = (callId: number) => {
    const call = calls.find(c => c.id === callId);
    if (!call) return { label: "Não encontrado", className: "bg-slate-100 text-slate-700" };

    const variants: Record<string, { label: string; className: string }> = {
      open: { label: "Aberto", className: "bg-purple-100 text-purple-700" },
      in_progress: { label: "Em Andamento", className: "bg-blue-100 text-blue-700" },
      resolved: { label: "Resolvido", className: "bg-green-100 text-green-700" },
      closed: { label: "Fechado", className: "bg-slate-100 text-slate-700" }
    };
    return variants[call.status] || variants.open;
  };

  const getPriorityBadge = (callId: number) => {
    const call = calls.find(c => c.id === callId);
    if (!call) return { label: "", className: "" };

    const variants: Record<string, { label: string; className: string }> = {
      low: { label: "Baixa", className: "bg-slate-100 text-slate-700" },
      medium: { label: "Média", className: "bg-blue-100 text-blue-700" },
      high: { label: "Alta", className: "bg-orange-100 text-orange-700" },
      urgent: { label: "Urgente", className: "bg-red-100 text-red-700" }
    };
    return variants[call.priority] || variants.medium;
  };

  const uniqueCalls = Array.from(new Set(comments.map(c => c.callId))).map(id => {
    const comment = comments.find(c => c.callId === id);
    return { id, title: comment?.callTitle || "" };
  });

  return (
    <>
      <PageHeader
        title="Comentários de Chamados"
        description="Visualize e gerencie comentários dos chamados"
        icon={MessageSquare}
        color="from-pink-500 to-pink-600"
        onNavigate={onNavigate}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <div className="mb-6">
          <Select value={selectedCall} onValueChange={setSelectedCall}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Filtrar por chamado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os chamados</SelectItem>
              {uniqueCalls.map(call => (
                <SelectItem key={call.id} value={call.id.toString()}>
                  #{call.id} - {call.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Comments List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredComments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Nenhum comentário encontrado</p>
              </div>
            ) : (
              filteredComments.map((comment) => {
                const statusBadge = getStatusBadge(comment.callId);
                const priorityBadge = getPriorityBadge(comment.callId);
                
                return (
                  <div key={comment.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-slate-900">{comment.author}</div>
                            <div className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                              Chamado #{comment.callId}: {comment.callTitle}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Badge className={statusBadge.className}>
                                {statusBadge.label}
                              </Badge>
                              {priorityBadge.label && (
                                <Badge className={priorityBadge.className}>
                                  {priorityBadge.label}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <span className="text-slate-400 text-sm">{comment.createdAt}</span>
                        </div>
                        <p className="text-slate-600 mt-3">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Add Comment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Novo Comentário
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 mb-2 block">Chamado</label>
                  <Select value={selectedCall === "all" ? "" : selectedCall} onValueChange={setSelectedCall}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o chamado" />
                    </SelectTrigger>
                    <SelectContent>
                      {calls.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Nenhum chamado disponível
                        </SelectItem>
                      ) : (
                        calls.map(call => (
                          <SelectItem key={call.id} value={call.id.toString()}>
                            #{call.id} - {call.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-2 block">Seu nome</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-2 block">Comentário</label>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Digite seu comentário..."
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={handleAddComment} 
                  className="w-full gap-2 bg-gradient-to-r from-pink-500 to-pink-600"
                  disabled={!newComment.trim() || !newAuthor.trim() || !selectedCall || selectedCall === "all" || calls.length === 0}
                >
                  <Send className="w-4 h-4" />
                  Enviar Comentário
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}