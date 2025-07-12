import React from 'react'
import { Card, Col } from 'react-bootstrap'

interface SaldoTotalProps {
  valor: number
}

const SaldoTotal: React.FC<SaldoTotalProps> = ({ valor }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <Col md={3}>
      <Card className="text-center h-100" style={{ borderLeft: '4px solid #007bff' }}>
        <Card.Body>
          <Card.Title style={{ color: '#007bff', fontSize: '1rem', fontWeight: 'normal' }}>
            Saldo Total
          </Card.Title>
          <Card.Text className="h4 mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
            {formatCurrency(valor)}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default SaldoTotal
