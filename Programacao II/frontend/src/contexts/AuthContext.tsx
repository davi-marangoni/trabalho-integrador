import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth as useAuthHook } from '../hooks/useAuth'
import { Usuario, SolicitacaoLogin } from '../types'

interface AuthContextType {
  usuario: Usuario | null
  carregando: boolean
  erro: string | null
  login: (credenciais: SolicitacaoLogin) => Promise<boolean>
  logout: () => Promise<void>
  estaAutenticado: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthHook()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
