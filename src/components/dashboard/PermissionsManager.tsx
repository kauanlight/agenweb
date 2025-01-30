'use client'

import { useState } from 'react'
import { 
  User, 
  Shield, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  UserRole, 
  PermissionConfig, 
  ROLE_PERMISSIONS, 
  createUser 
} from '@/lib/permissions'

interface UserPermission {
  id: string
  name: string
  email: string
  role: UserRole
  vertical?: 'healthcare' | 'ecommerce'
  permissions: PermissionConfig
}

export default function PermissionsManager() {
  const [users, setUsers] = useState<UserPermission[]>([
    {
      id: '1',
      name: 'Admin Principal',
      email: 'admin@assistpro.com',
      role: 'admin',
      permissions: ROLE_PERMISSIONS['admin']
    }
  ])

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer' as UserRole,
    vertical: undefined as UserPermission['vertical']
  })

  const handleCreateUser = () => {
    const userToAdd = createUser(
      newUser.name, 
      newUser.email, 
      newUser.role, 
      newUser.vertical
    )

    const userPermissions = {
      ...userToAdd,
      permissions: ROLE_PERMISSIONS[newUser.role]
    }

    setUsers(prev => [...prev, userPermissions])
    setIsAddUserModalOpen(false)
    setNewUser({ name: '', email: '', role: 'viewer', vertical: undefined })
  }

  const updateUserPermissions = (userId: string, updatedPermissions: Partial<PermissionConfig>) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, permissions: { ...user.permissions, ...updatedPermissions } }
          : user
      )
    )
  }

  const getRoleColor = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-600'
      case 'editor': return 'bg-yellow-100 text-yellow-600'
      case 'viewer': return 'bg-blue-100 text-blue-600'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Shield className="mr-2" /> Gerenciamento de Permissões
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAddUserModalOpen(true)}
        >
          Adicionar Usuário
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-medium flex items-center">
                    {user.name}
                    <span 
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                {user.role !== 'admin' && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setUsers(prev => prev.filter(u => u.id !== user.id))
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Remover
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Permissões de Dashboard</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Acesso ao Dashboard</span>
                      <Switch 
                        checked={user.permissions.dashboardAccess}
                        onCheckedChange={(checked) => 
                          updateUserPermissions(user.id, { dashboardAccess: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Visualizar Métricas</span>
                      <Switch 
                        checked={user.permissions.viewMetrics}
                        onCheckedChange={(checked) => 
                          updateUserPermissions(user.id, { viewMetrics: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Editar Métricas</span>
                      <Switch 
                        checked={user.permissions.editMetrics}
                        onCheckedChange={(checked) => 
                          updateUserPermissions(user.id, { editMetrics: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Permissões de Assistentes</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Criar Assistente</span>
                      <Switch 
                        checked={user.permissions.createAssistant}
                        onCheckedChange={(checked) => 
                          updateUserPermissions(user.id, { createAssistant: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Editar Assistente</span>
                      <Switch 
                        checked={user.permissions.editAssistant}
                        onCheckedChange={(checked) => 
                          updateUserPermissions(user.id, { editAssistant: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Deletar Assistente</span>
                      <Switch 
                        checked={user.permissions.deleteAssistant}
                        onCheckedChange={(checked) => 
                          updateUserPermissions(user.id, { deleteAssistant: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Dialog 
          open={isAddUserModalOpen} 
          onOpenChange={setIsAddUserModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo usuário
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Input 
                placeholder="Nome Completo" 
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({
                  ...prev, 
                  name: e.target.value
                }))}
              />
              
              <Input 
                type="email"
                placeholder="E-mail" 
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({
                  ...prev, 
                  email: e.target.value
                }))}
              />
              
              <Select 
                value={newUser.role} 
                onValueChange={(value) => setNewUser(prev => ({
                  ...prev, 
                  role: value as UserRole
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={newUser.vertical} 
                onValueChange={(value) => setNewUser(prev => ({
                  ...prev, 
                  vertical: value as UserPermission['vertical']
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vertical (Opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthcare">Saúde</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleCreateUser}
                disabled={!newUser.name || !newUser.email}
              >
                Adicionar Usuário
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
