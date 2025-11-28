import { useState } from "react";
import { Settings, Plus, Pencil, Trash2, Clock, AlertCircle } from "lucide-react";
import { Page } from "../App";
import { PageHeader } from "./PageHeader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Call {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo: string;
  createdAt: string;
}

interface CallsPageProps {
  onNavigate: (page: Page) => void;
}

export function CallsPage({ onNavigate }: CallsPageProps) {
  const [calls, setCalls] = useLocalStorage<Call[]>("calls", [
    { id: 1, title: "Sistema de login não funciona", description: "Usuários não conseguem fazer login", priority: "urgent", status: "in_progress", assignedTo: "Maria Santos", createdAt: "2024-01-20" },
    { id: 2, title: "Relatório de vendas com erro", description: "O relatório não está gerando corretamente", priority: "high", status: "open", assignedTo: "João Silva", createdAt: "2024-01-21" },
    { id: 3, title: "Solicitação de nova funcionalidade", description: "Cliente solicita filtro avançado", priority: "medium", status: "open", assignedTo: "Pedro Costa", createdAt: "2024-01-22" },
    { id: 4, title: "Lentidão no carregamento", description: "Páginas demorando para carregar", priority: "low", status: "resolved", assignedTo: "Maria Santos", createdAt: "2024-01-19" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCall, setEditingCall] = useState<Call | null>(null);
  const [formData, setFormData] = useState<Omit<Call, "id" | "createdAt">>({
    title: "",
    description: "",
    priority: "medium",
    status: "open",
    assignedTo: ""
  });

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || call.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddCall = () => {
    setEditingCall(null);
    setFormData({ title: "", description: "", priority: "medium", status: "open", assignedTo: "" });
    setIsDialogOpen(true);
  };

  const handleEditCall = (call: Call) => {
    setEditingCall(call);
    setFormData({ title: call.title, description: call.description, priority: call.priority, status: call.status, assignedTo: call.assignedTo });
    setIsDialogOpen(true);
  };

  const handleDeleteCall = (id: number) => {
    setCalls(calls.filter(call => call.id !== id));
  };

  const handleSaveCall = () => {
    if (editingCall) {
      setCalls(calls.map(call => call.id === editingCall.id ? { ...formData, id: editingCall.id, createdAt: editingCall.createdAt } : call));
    } else {
      const newCall: Call = {
        ...formData,
        id: Math.max(...calls.map(c => c.id), 0) + 1,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCalls([...calls, newCall]);
    }
    setIsDialogOpen(false);
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { label: string; className: string; icon: any }> = {
      low: { label: "Baixa", className: "bg-slate-100 text-slate-700", icon: null },
      medium: { label: "Média", className: "bg-blue-100 text-blue-700", icon: null },
      high: { label: "Alta", className: "bg-orange-100 text-orange-700", icon: AlertCircle },
      urgent: { label: "Urgente", className: "bg-red-100 text-red-700", icon: AlertCircle }
    };
    return variants[priority] || variants.medium;
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

  return (
    <>
      <PageHeader
        title="Chamados"
        description="Gerencie os chamados do sistema"
        icon={Settings}
        color="from-purple-500 to-purple-600"
        onNavigate={onNavigate}
        action={
          <Button onClick={handleAddCall} className="gap-2 bg-gradient-to-r from-purple-500 to-purple-600">
            <Plus className="w-4 h-4" />
            Novo Chamado
          </Button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Buscar chamado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCalls.map((call) => {
            const priorityBadge = getPriorityBadge(call.priority);
            const statusBadge = getStatusBadge(call.status);
            const PriorityIcon = priorityBadge.icon;

            return (
              <div key={call.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-slate-900 mb-2">{call.title}</h3>
                    <p className="text-slate-600 text-sm mb-3">{call.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={priorityBadge.className}>
                        {PriorityIcon && <PriorityIcon className="w-3 h-3 mr-1" />}
                        {priorityBadge.label}
                      </Badge>
                      <Badge className={statusBadge.className}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs">
                      {call.assignedTo.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-slate-900">{call.assignedTo}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {new Date(call.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCall(call)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCall(call.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{editingCall ? "Editar Chamado" : "Novo Chamado"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do chamado"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o problema ou solicitação"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Responsável</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                placeholder="Nome do responsável"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCall} className="bg-gradient-to-r from-purple-500 to-purple-600">
              {editingCall ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}