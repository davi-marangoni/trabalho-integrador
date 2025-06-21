import React from 'react'
import { Outlet } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import Sidebar from './Sidebar'

const Layout: React.FC = () => {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={3} lg={2} className="sidebar">
          <Sidebar />
        </Col>
        <Col md={9} lg={10} className="main-content">
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}

export default Layout
