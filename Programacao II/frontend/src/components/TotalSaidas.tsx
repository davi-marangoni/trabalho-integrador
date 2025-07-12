import React from 'react'
import { Card, Col } from 'react-bootstrap'

interface TotalSaidasProps {
  valor: number
}

const TotalSaidas: React.FC<TotalSaidasProps> = ({ valor }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <Col md={3}>
      <Card className="text-center h-100" style={{ borderLeft: '4px solid #dc3545' }}>
        <Card.Body>
          <Card.Title style={{ color: '#dc3545', fontSize: '1rem', fontWeight: 'normal' }}>
            Total de Saídas
          </Card.Title>
          <Card.Text className="h4 mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
            {formatCurrency(valor)}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default TotalSaidas
