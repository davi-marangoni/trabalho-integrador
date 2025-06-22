import React, { useState, createContext, useContext } from 'react'
import { Outlet } from 'react-router-dom'
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
      <div className="app-layout">
        {/* Sidebar fixa */}
        <div className={`sidebar-fixed ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          <Sidebar />
        </div>

        {/* Conteúdo principal com margin dinâmico */}
        <div className={`main-content-wrapper ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
          <div className="main-content">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

export default Layout
