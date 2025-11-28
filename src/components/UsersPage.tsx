import { useState } from "react";
import { Users, Plus, Pencil, Trash2, Mail, Phone, Shield } from "lucide-react";
import { Page } from "../App";
import { PageHeader } from "./PageHeader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "support";
  status: "active" | "inactive";
}

interface UsersPageProps {
  onNavigate: (page: Page) => void;
}

export function UsersPage({ onNavigate }: UsersPageProps) {
  const [users, setUsers] = useLocalStorage<User[]>("users", [
    { id: 1, name: "João Silva", email: "joao@email.com", phone: "(11) 98765-4321", role: "admin", status: "active" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", phone: "(11) 98765-1234", role: "support", status: "active" },
    { id: 3, name: "Pedro Costa", email: "pedro@email.com", phone: "(11) 98765-5678", role: "user", status: "active" },
    { id: 4, name: "Ana Paula", email: "ana@email.com", phone: "(11) 98765-9012", role: "user", status: "inactive" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    phone: "",
    role: "user",
    status: "active"
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", phone: "", role: "user", status: "active" });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, phone: user.phone, role: user.role, status: user.status });
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map(user => user.id === editingUser.id ? { ...formData, id: editingUser.id } : user));
    } else {
      const newUser: User = {
        ...formData,
        id: Math.max(...users.map(u => u.id), 0) + 1
      };
      setUsers([...users, newUser]);
    }
    setIsDialogOpen(false);
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      admin: { label: "Admin", className: "bg-purple-100 text-purple-700" },
      support: { label: "Suporte", className: "bg-blue-100 text-blue-700" },
      user: { label: "Usuário", className: "bg-slate-100 text-slate-700" }
    };
    return variants[role] || variants.user;
  };

  const getStatusBadge = (status: string) => {
    return status === "active"
      ? { label: "Ativo", className: "bg-green-100 text-green-700" }
      : { label: "Inativo", className: "bg-red-100 text-red-700" };
  };

  return (
    <>
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários do sistema"
        icon={Users}
        color="from-blue-500 to-blue-600"
        onNavigate={onNavigate}
        action={
          <Button onClick={handleAddUser} className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600">
            <Plus className="w-4 h-4" />
            Adicionar Usuário
          </Button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Buscar usuário por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-slate-900">Nome</th>
                  <th className="px-6 py-4 text-left text-slate-900">Contato</th>
                  <th className="px-6 py-4 text-left text-slate-900">Permissão</th>
                  <th className="px-6 py-4 text-left text-slate-900">Status</th>
                  <th className="px-6 py-4 text-right text-slate-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const statusBadge = getStatusBadge(user.status);
                  
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-slate-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={roleBadge.className}>
                          <Shield className="w-3 h-3 mr-1" />
                          {roleBadge.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={statusBadge.className}>
                          {statusBadge.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuário" : "Adicionar Usuário"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 98765-4321"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Permissão</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="support">Suporte</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
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
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser} className="bg-gradient-to-r from-blue-500 to-blue-600">
              {editingUser ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}