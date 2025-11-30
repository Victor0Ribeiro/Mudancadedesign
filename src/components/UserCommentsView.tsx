import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Send, MessageCircle, AlertCircle, User as UserIcon } from "lucide-react";

interface Call {
  id: number;
  title: string;
  priority: string;
  status: string;
}

interface Comment {
  id: number;
  callId: number;
  userName: string;
  text: string;
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

export function UserCommentsView() {
  const [calls] = useLocalStorage<Call[]>("calls", []);
  const [comments, setComments] = useLocalStorage<Comment[]>("comments", []);
  const [users] = useLocalStorage<User[]>("users", []);
  
  // Filtrar apenas usuários com role "user"
  const regularUsers = users.filter(user => user.role === "user");
  const [selectedCallId, setSelectedCallId] = useState<number | "">(""); 
  const [selectedUserName, setSelectedUserName] = useState<string>(""); 
  const [commentText, setCommentText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCallId || !selectedUserName || !commentText.trim()) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    const newComment: Comment = {
      id: comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1,
      callId: Number(selectedCallId),
      userName: selectedUserName,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    
    // Reset form
    setCommentText("");
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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

  // Filter comments for selected call
  const callComments = selectedCallId
    ? comments.filter((c) => c.callId === Number(selectedCallId)).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-green-800">Comentário adicionado com sucesso!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Comentários de Chamados</h1>
        <p className="text-slate-600">Adicione comentários e acompanhe discussões sobre chamados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-slate-900 mb-6">Adicionar Comentário</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Call */}
            <div>
              <label htmlFor="call" className="block text-slate-700 mb-2">
                Selecione o Chamado <span className="text-red-500">*</span>
              </label>
              <select
                id="call"
                value={selectedCallId}
                onChange={(e) => setSelectedCallId(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Selecione um chamado</option>
                {calls.map((call) => (
                  <option key={call.id} value={call.id}>
                    {call.title}
                  </option>
                ))}
              </select>
              {calls.length === 0 && (
                <p className="mt-2 text-amber-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Nenhum chamado disponível
                </p>
              )}
            </div>

            {/* Select User */}
            <div>
              <label htmlFor="user" className="block text-slate-700 mb-2">
                Selecione seu Usuário <span className="text-red-500">*</span>
              </label>
              <select
                id="user"
                value={selectedUserName}
                onChange={(e) => setSelectedUserName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Selecione um usuário</option>
                {regularUsers.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
              {regularUsers.length === 0 && (
                <p className="mt-2 text-amber-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Nenhum usuário regular cadastrado.
                </p>
              )}
            </div>

            {/* Comment Text */}
            <div>
              <label htmlFor="comment" className="block text-slate-700 mb-2">
                Seu Comentário <span className="text-red-500">*</span>
              </label>
              <textarea
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Digite seu comentário..."
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Enviar Comentário
            </button>
          </form>
        </div>

        {/* Comments List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-slate-900 mb-6">Comentários do Chamado</h2>
          
          {!selectedCallId ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600">Selecione um chamado para ver os comentários</p>
            </div>
          ) : callComments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600">Nenhum comentário ainda</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {callComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-slate-900">{comment.userName}</span>
                        <span className="text-slate-500 text-sm">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-slate-700">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
