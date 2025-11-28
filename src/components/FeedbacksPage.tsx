import { useState } from "react";
import { BarChart3, Plus, Star, ThumbsUp, Trash2 } from "lucide-react";
import { Page } from "../App";
import { PageHeader } from "./PageHeader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Feedback {
  id: number;
  author: string;
  email: string;
  rating: number;
  category: string;
  message: string;
  createdAt: string;
}

interface FeedbacksPageProps {
  onNavigate: (page: Page) => void;
}

export function FeedbacksPage({ onNavigate }: FeedbacksPageProps) {
  const [feedbacks, setFeedbacks] = useLocalStorage<Feedback[]>("feedbacks", [
    { id: 1, author: "João Silva", email: "joao@email.com", rating: 5, category: "Funcionalidade", message: "Sistema muito intuitivo e fácil de usar!", createdAt: "2024-01-20" },
    { id: 2, author: "Maria Santos", email: "maria@email.com", rating: 4, category: "Performance", message: "Boa velocidade, mas poderia melhorar em alguns pontos.", createdAt: "2024-01-21" },
    { id: 3, author: "Pedro Costa", email: "pedro@email.com", rating: 5, category: "Interface", message: "Design moderno e agradável!", createdAt: "2024-01-22" },
    { id: 4, author: "Ana Paula", email: "ana@email.com", rating: 3, category: "Suporte", message: "Atendimento bom, mas demorou um pouco.", createdAt: "2024-01-22" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    author: "",
    email: "",
    rating: 5,
    category: "",
    message: ""
  });

  const handleAddFeedback = () => {
    setFormData({ author: "", email: "", rating: 5, category: "", message: "" });
    setIsDialogOpen(true);
  };

  const handleSaveFeedback = () => {
    const newFeedback: Feedback = {
      ...formData,
      id: Math.max(...feedbacks.map(f => f.id), 0) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFeedbacks([...feedbacks, newFeedback]);
    setIsDialogOpen(false);
  };

  const handleDeleteFeedback = (id: number) => {
    setFeedbacks(feedbacks.filter(f => f.id !== id));
  };

  const averageRating = feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length;

  return (
    <>
      <PageHeader
        title="Feedbacks"
        description="Avaliações e sugestões dos usuários"
        icon={BarChart3}
        color="from-orange-500 to-orange-600"
        onNavigate={onNavigate}
        action={
          <Button onClick={handleAddFeedback} className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600">
            <Plus className="w-4 h-4" />
            Novo Feedback
          </Button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total de Feedbacks</p>
                <p className="text-slate-900 mt-1">{feedbacks.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Avaliação Média</p>
                <p className="text-slate-900 mt-1">{averageRating.toFixed(1)} / 5.0</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Feedbacks Positivos</p>
                <p className="text-slate-900 mt-1">{feedbacks.filter(f => f.rating >= 4).length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
                <ThumbsUp className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Feedbacks List */}
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white flex-shrink-0">
                    {feedback.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-slate-900">{feedback.author}</h3>
                      <span className="text-slate-400 text-sm">{feedback.email}</span>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">
                        {feedback.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < feedback.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                      <span className="text-slate-600 text-sm ml-2">
                        {feedback.rating}.0
                      </span>
                    </div>
                    <p className="text-slate-600">{feedback.message}</p>
                    <p className="text-slate-400 text-sm mt-2">
                      {new Date(feedback.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteFeedback(feedback.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Novo Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="author">Nome</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Seu nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Funcionalidade, Performance, Interface"
              />
            </div>
            <div className="space-y-2">
              <Label>Avaliação</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Compartilhe sua experiência..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveFeedback} className="bg-gradient-to-r from-orange-500 to-orange-600">
              Enviar Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}