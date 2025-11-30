import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Star, Send, AlertCircle } from "lucide-react";

interface Feedback {
  id: number;
  userName: string;
  callId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Call {
  id: number;
  title: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "support";
  status: "active" | "inactive";
}

export function UserFeedbackView() {
  const [feedbacks, setFeedbacks] = useLocalStorage<Feedback[]>("feedbacks", []);
  const [calls] = useLocalStorage<Call[]>("calls", []);
  const [users] = useLocalStorage<User[]>("users", []);
  
  // Filtrar apenas usuários com role "user"
  const regularUsers = users.filter(user => user.role === "user");
  const [selectedCallId, setSelectedCallId] = useState<number | "">(""); 
  const [selectedUserName, setSelectedUserName] = useState<string>(""); 
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCallId || !selectedUserName || rating === 0) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const newFeedback: Feedback = {
      id: feedbacks.length > 0 ? Math.max(...feedbacks.map(f => f.id)) + 1 : 1,
      userName: selectedUserName,
      callId: Number(selectedCallId),
      rating: rating,
      comment: comment,
      createdAt: new Date().toISOString(),
    };

    setFeedbacks([...feedbacks, newFeedback]);
    
    // Reset form
    setSelectedCallId("");
    setSelectedUserName("");
    setRating(0);
    setComment("");
    
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
            <Star className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-green-800">Feedback enviado com sucesso!</p>
            <p className="text-green-600 text-sm">Obrigado pela sua avaliação</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Dar Feedback</h1>
        <p className="text-slate-600">Avalie o atendimento do chamado e deixe seu comentário</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        {/* Select Call */}
        <div>
          <label htmlFor="call" className="block text-slate-700 mb-2">
            Selecione o Chamado <span className="text-red-500">*</span>
          </label>
          <select
            id="call"
            value={selectedCallId}
            onChange={(e) => setSelectedCallId(Number(e.target.value))}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
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
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
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

        {/* Rating */}
        <div>
          <label className="block text-slate-700 mb-3">
            Avaliação <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-all hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoveredRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-none text-slate-300"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-3 text-slate-600">
                {rating} de 5 estrelas
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-slate-700 mb-2">
            Comentário (opcional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte-nos sobre sua experiência..."
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Enviar Feedback
        </button>
      </form>
    </div>
  );
}
