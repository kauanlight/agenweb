'use client'

import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit 
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
}

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Kauan Guedes',
      email: 'kauan@agenweb.ai',
      role: 'admin'
    }
  ])

  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'viewer' as TeamMember['role']
  })

  const handleAddMember = () => {
    const member: TeamMember = {
      id: String(teamMembers.length + 1),
      ...newMember
    }
    setTeamMembers([...teamMembers, member])
    setIsAddMemberDialogOpen(false)
    setNewMember({ name: '', email: '', role: 'viewer' })
  }

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Users className="mr-2" /> Colaboradores
        </CardTitle>
        <Dialog 
          open={isAddMemberDialogOpen} 
          onOpenChange={setIsAddMemberDialogOpen}
        >
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Colaborador</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block mb-2">Nome</label>
                <Input 
                  placeholder="Nome do colaborador"
                  value={newMember.name}
                  onChange={(e) => setNewMember({
                    ...newMember, 
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <Input 
                  placeholder="Email do colaborador"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({
                    ...newMember, 
                    email: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block mb-2">Função</label>
                <Select
                  value={newMember.role}
                  onValueChange={(value: TeamMember['role']) => setNewMember({
                    ...newMember, 
                    role: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAddMember}
                disabled={!newMember.name || !newMember.email}
              >
                Adicionar Colaborador
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-gray-500">{member.email}</div>
                <div className="text-xs text-gray-400 capitalize">
                  {member.role === 'admin' ? 'Administrador' : 
                   member.role === 'editor' ? 'Editor' : 'Visualizador'}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
