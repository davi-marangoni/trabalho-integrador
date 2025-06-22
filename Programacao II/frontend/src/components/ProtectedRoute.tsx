import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Spinner, Container } from 'react-bootstrap'

interface RotaProtegidaProps {
  children: React.ReactNode
}

const RotaProtegida: React.FC<RotaProtegidaProps> = ({ children }) => {
  const { estaAutenticado, carregando } = useAuth()
  const location = useLocation()

  if (carregando) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    )
  }

  if (!estaAutenticado) {
    // Redireciona para login e salva a localização atual
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default RotaProtegida
