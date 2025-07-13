import React, { ReactNode, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface AdminRouteProps {
  children: ReactNode
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { usuario, carregando } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Só redireciona se o usuário está carregado e não é administrador
    if (!carregando && usuario && usuario.tipo !== 1) {
      navigate('/', { replace: true })
    }
  }, [usuario, carregando, navigate])

  if (carregando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  // Se não está logado, redireciona para login
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  // Se não é administrador, redireciona para dashboard
  if (usuario.tipo !== 1) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute
