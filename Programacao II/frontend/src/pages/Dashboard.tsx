import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'

const Dashboard: React.FC = () => {
  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h1>Dashboard</h1>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total de Veículos</Card.Title>
              <Card.Text className="h2">--</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Veículos Ativos</Card.Title>
              <Card.Text className="h2">--</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Sistema de Gestão de Frota</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>Bem-vindo ao Sistema de Gestão de Frota!</p>
              <p>Aqui você pode gerenciar os veículos da sua frota de forma simples e eficiente.</p>
              <ul>
                <li><strong>Dashboard:</strong> Visualize informações resumidas sobre sua frota</li>
                <li><strong>Veículos:</strong> Cadastre, edite e gerencie todos os veículos</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  )
}

export default Dashboard
