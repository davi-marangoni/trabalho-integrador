import React, { useState, createContext, useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import Sidebar from './Sidebar'

// Context para compartilhar o estado da sidebar
const SidebarContext = createContext<{
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
} | null>(null)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}

const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col className={`sidebar-col ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            <Sidebar />
          </Col>
          <Col style={{ marginLeft: 0 }}>
            <div className="main-content">
              <Outlet />
            </div>
          </Col>
        </Row>
      </Container>
    </SidebarContext.Provider>
  )
}

export default Layout
