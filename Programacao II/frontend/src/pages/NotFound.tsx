import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const PaginaNaoEncontrada: React.FC = () => {
  const navegar = useNavigate()

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row>
        <Col>
          <Card className="text-center">
            <Card.Body className="p-5">
              <h1 className="display-1">404</h1>
              <h2>Página não encontrada</h2>
              <p className="text-muted mb-4">
                A página que você está procurando não existe.
              </p>
              <Button variant="primary" onClick={() => navegar('/')}>
                Voltar ao Dashboard
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PaginaNaoEncontrada
