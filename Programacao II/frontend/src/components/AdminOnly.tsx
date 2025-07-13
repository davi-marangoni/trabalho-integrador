import React, { ReactNode } from 'react'
import { Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'

interface AdminOnlyProps {
  children: ReactNode
  message?: string
}

/**
 * Componente que só renderiza o conteúdo se o usuário for administrador
 * Útil para esconder elementos específicos baseado no tipo de usuário
 */
const AdminOnly: React.FC<AdminOnlyProps> = ({
  children,
  message = "Acesso restrito a administradores"
}) => {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return null
  }

  // Se não é administrador, pode mostrar uma mensagem ou não renderizar nada
  if (!usuario || usuario.tipo !== 1) {
    return (
      <Alert variant="warning" className="text-center">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {message}
      </Alert>
    )
  }

  return <>{children}</>
}

export default AdminOnly
