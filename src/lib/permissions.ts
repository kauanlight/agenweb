import { v4 as uuidv4 } from 'uuid'

export type UserRole = 'admin' | 'editor' | 'viewer'

export interface PermissionConfig {
  dashboardAccess: boolean
  viewMetrics: boolean
  editMetrics: boolean
  createAssistant: boolean
  editAssistant: boolean
  deleteAssistant: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, PermissionConfig> = {
  admin: {
    dashboardAccess: true,
    viewMetrics: true,
    editMetrics: true,
    createAssistant: true,
    editAssistant: true,
    deleteAssistant: true
  },
  editor: {
    dashboardAccess: true,
    viewMetrics: true,
    editMetrics: false,
    createAssistant: true,
    editAssistant: true,
    deleteAssistant: false
  },
  viewer: {
    dashboardAccess: true,
    viewMetrics: true,
    editMetrics: false,
    createAssistant: false,
    editAssistant: false,
    deleteAssistant: false
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  vertical?: 'healthcare' | 'ecommerce'
}

export function createUser(
  name: string, 
  email: string, 
  role: UserRole = 'viewer', 
  vertical?: 'healthcare' | 'ecommerce'
): User {
  return {
    id: uuidv4(),
    name,
    email,
    role,
    vertical
  }
}

export function checkPermission(
  user: User, 
  requiredPermission: keyof PermissionConfig
): boolean {
  return ROLE_PERMISSIONS[user.role][requiredPermission]
}

export function filterUsersByVertical(
  users: User[], 
  vertical: 'healthcare' | 'ecommerce'
): User[] {
  return users.filter(user => user.vertical === vertical)
}

export function getUserRoleHierarchy(role: UserRole): UserRole[] {
  const roleHierarchy: Record<UserRole, UserRole[]> = {
    admin: ['admin', 'editor', 'viewer'],
    editor: ['editor', 'viewer'],
    viewer: ['viewer']
  }
  return roleHierarchy[role]
}
