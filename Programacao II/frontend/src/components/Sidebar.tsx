import React from 'react'
import { Nav, Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const itensMenu = [
    { caminho: '/', label: 'Dashboard', icone: '📊' },
    { caminho: '/veiculos', label: 'Veículos', icone: '🚛' },
  ]

  const lidarComLogout = () => {
    // TODO: Implementar logout
    navigate('/login')
  }

  return (
    <div className="sidebar">
      <Nav defaultActiveKey="/" className="flex-column p-3">
        {itensMenu.map((item) => (
          <Nav.Link
            key={item.caminho}
            onClick={() => navigate(item.caminho)}
            active={location.pathname === item.caminho}
            className="mb-2"
          >
            <span className="me-2">{item.icone}</span>
            {item.label}
          </Nav.Link>
        ))}
        
        <hr className="my-3" />
        
        <Button 
          variant="outline-danger" 
          onClick={lidarComLogout}
          className="w-100"
        >
          🚪 Sair
        </Button>
      </Nav>
    </div>
  )
}

export default Sidebar
