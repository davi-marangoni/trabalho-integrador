import React from 'react'
import { Nav, Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSidebar } from './Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartBar,
  faTruck,
  faSignOutAlt,
  faBars,
  faChevronLeft
} from '@fortawesome/free-solid-svg-icons'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, usuario } = useAuth()
  const { isCollapsed, setIsCollapsed } = useSidebar()

  const itensMenu = [
    { caminho: '/', label: 'Dashboard', icone: faChartBar },
    { caminho: '/veiculos', label: 'Veículos', icone: faTruck },
    { caminho: '/lancamentos', label: 'Lançamentos', icone: faChartBar }
  ]

  const lidarComLogout = async () => {
    await logout()
    navigate('/login')
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <Nav defaultActiveKey="/" className="flex-column p-3 h-100">
        {/* Botão toggle - agora no topo da área de navegação */}
        <div className={`d-flex mb-3 ${isCollapsed ? 'justify-content-center' : 'justify-content-end'}`}>
          <div className="toggle-btn" onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={isCollapsed ? faBars : faChevronLeft} size="lg" />
          </div>
        </div>

        {/* Área dos itens de menu */}
        <div className="flex-grow-1">
          {itensMenu.map((item) => (
            <Nav.Link
              key={item.caminho}
              onClick={() => navigate(item.caminho)}
              active={location.pathname === item.caminho}
              className={`mb-2 d-flex align-items-center ${isCollapsed ? 'justify-content-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <FontAwesomeIcon icon={item.icone} className={isCollapsed ? '' : 'me-2'} />
              {!isCollapsed && <span className="nav-text">{item.label}</span>}
            </Nav.Link>
          ))}
        </div>

        {/* Área inferior com informações do usuário e botão sair */}
        <div className="mt-auto">
          <hr className="my-3" />

          {/* Informações do usuário - agora embaixo */}
          {!isCollapsed && (
            <div className="mb-3 p-2 bg-light rounded user-info">
              <small className="text-muted user-info-text">Logado como:</small>
              <div className="fw-bold user-info-text">{usuario?.email}</div>
              <small className="text-muted user-info-text">
                {usuario?.tipo === 1 ? 'Administrador' : 'Usuário'}
              </small>
            </div>
          )}

          <Button
            variant="outline-danger"
            onClick={lidarComLogout}
            className={`w-100 d-flex align-items-center ${isCollapsed ? 'justify-content-center' : ''}`}
            title={isCollapsed ? 'Sair' : ''}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            {!isCollapsed && <span className="logout-text ms-1">Sair</span>}
          </Button>
        </div>
      </Nav>
    </div>
  )
}

export default Sidebar
