import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { User, BookOpen, Palette } from "lucide-react";

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Sobre o Projeto</DialogTitle>
          <DialogDescription className="text-center">
            Informações sobre o criador e o projeto
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
              <User className="w-10 h-10" />
            </div>
          </div>

          {/* Creator Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              <p className="text-slate-900">
                Criado por <span className="font-semibold text-purple-600">Victor Ribeiro</span>
              </p>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-slate-700">
                  <span className="font-semibold">Projeto Extensionista:</span> Itinerário
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Palette className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-slate-700">
                  <span className="font-semibold">Disciplina de</span> Design UI/UX
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-slate-500 text-sm">
              Sistema de Gerenciamento de Chamados
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
