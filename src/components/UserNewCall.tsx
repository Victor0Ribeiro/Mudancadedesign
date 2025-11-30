import { useState } from "react";
import { Send, AlertCircle } from "lucide-react";
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

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "support";
  status: "active" | "inactive";
}

export function UserNewCall() {
  const [calls, setCalls] = useLocalStorage<Call[]>("calls", []);
  const [users] = useLocalStorage<User[]>("users", []);
  
  // Filtrar apenas usuários com role "support"
  const supportUsers = users.filter(user => user.role === "support");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [assignedTo, setAssignedTo] = useState<string>(""); 
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !assignedTo) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const newCall: Call = {
      id: calls.length > 0 ? Math.max(...calls.map(c => c.id)) + 1 : 1,
      title,
      description,
      priority,
      status: "open",
      assignedTo,
      createdAt: new Date().toISOString(),
    };

    setCalls([...calls, newCall]);
    
    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignedTo("");
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Send className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-green-800">Chamado criado com sucesso!</p>
            <p className="text-green-600 text-sm">Você pode acompanhá-lo na aba "Ver Chamados"</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Abrir Novo Chamado</h1>
        <p className="text-slate-600">Preencha as informações abaixo para criar um novo chamado</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-slate-700 mb-2">
            Título do Chamado <span className="text-red-500">*</span>
          </label>
          <input
            id="titulo"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Erro ao fazer login no sistema"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="descricao" className="block text-slate-700 mb-2">
            Descrição <span className="text-red-500">*</span>
          </label>
          <textarea
            id="descricao"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o problema com detalhes..."
            rows={6}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
            required
          />
        </div>

        {/* Usuario */}
        <div>
          <label htmlFor="usuario" className="block text-slate-700 mb-2">
            Responsável (Suporte) <span className="text-red-500">*</span>
          </label>
          <select
            id="usuario"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            required
          >
            <option value="">Selecione um responsável</option>
            {supportUsers.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
          {supportUsers.length === 0 && (
            <p className="mt-2 text-amber-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Nenhum usuário de suporte cadastrado. Entre em contato com o administrador.
            </p>
          )}
        </div>

        {/* Prioridade */}
        <div>
          <label className="block text-slate-700 mb-2">
            Prioridade <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setPriority("low")}
              className={`p-3 rounded-lg border-2 transition-all ${
                priority === "low"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-slate-200 hover:border-green-300 text-slate-600"
              }`}
            >
              Baixa
            </button>
            <button
              type="button"
              onClick={() => setPriority("medium")}
              className={`p-3 rounded-lg border-2 transition-all ${
                priority === "medium"
                  ? "border-amber-500 bg-amber-50 text-amber-700"
                  : "border-slate-200 hover:border-amber-300 text-slate-600"
              }`}
            >
              Média
            </button>
            <button
              type="button"
              onClick={() => setPriority("high")}
              className={`p-3 rounded-lg border-2 transition-all ${
                priority === "high"
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-slate-200 hover:border-orange-300 text-slate-600"
              }`}
            >
              Alta
            </button>
            <button
              type="button"
              onClick={() => setPriority("urgent")}
              className={`p-3 rounded-lg border-2 transition-all ${
                priority === "urgent"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-slate-200 hover:border-red-300 text-slate-600"
              }`}
            >
              Urgente
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Enviar Chamado
        </button>
      </form>
    </div>
  );
}
