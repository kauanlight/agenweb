'use client'

import React, { 
  createContext, 
  useState, 
  useContext, 
  ReactNode, 
  useCallback,
  useMemo
} from 'react'
import { 
  User, 
  UserRole, 
  PermissionConfig, 
  ROLE_PERMISSIONS, 
  createUser, 
  checkPermission 
} from '@/lib/permissions'

interface PermissionsContextType {
  currentUser: User | null
  users: User[]
  login: (email: string, password: string) => boolean
  logout: () => void
  addUser: (user: Omit<User, 'id'>) => void
  removeUser: (userId: string) => void
  updateUserRole: (userId: string, newRole: UserRole) => void
  canPerformAction: (action: keyof PermissionConfig) => boolean
  isAuthenticated: () => boolean
  ensureAuthentication: () => void
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

export const PermissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([
    createUser('Admin Principal', 'admin@assistpro.com', 'admin')
  ])

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const adminUser = users.find(u => u.role === 'admin')
    return adminUser || null
  })

  const login = useCallback((email: string, password: string) => {
    const user = users.find(u => u.email === email)
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }, [users])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    const newUser = createUser(
      userData.name, 
      userData.email, 
      userData.role, 
      userData.vertical
    )
    setUsers(prev => [...prev, newUser])
  }, [])

  const removeUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }, [])

  const updateUserRole = useCallback((userId: string, newRole: UserRole) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    )
  }, [])

  const canPerformAction = useCallback((action: keyof PermissionConfig) => {
    return currentUser ? checkPermission(currentUser, action) : false
  }, [currentUser])

  const isAuthenticated = useCallback(() => {
    return !!currentUser
  }, [currentUser])

  const ensureAuthentication = useCallback(() => {
    if (!currentUser) {
      const adminUser = users.find(u => u.role === 'admin')
      if (adminUser) {
        setCurrentUser(adminUser)
      }
    }
  }, [currentUser, users])

  const contextValue = useMemo(() => ({
    currentUser, 
    users,
    login, 
    logout, 
    addUser, 
    removeUser, 
    updateUserRole,
    canPerformAction,
    isAuthenticated,
    ensureAuthentication
  }), [
    currentUser, 
    users,
    login, 
    logout, 
    addUser, 
    removeUser, 
    updateUserRole,
    canPerformAction,
    isAuthenticated,
    ensureAuthentication
  ])

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  )
}

export const usePermissions = () => {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }
  return context
}
