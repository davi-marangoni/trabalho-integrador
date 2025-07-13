import React, { useState, useEffect } from 'react'
import { Card, Col } from 'react-bootstrap'
import { SaldoTotalProps } from '../types/saldoTotal'

const SaldoTotal: React.FC<SaldoTotalProps> = ({ totalEntradas, totalSaidas }) => {
  const [saldo, setSaldo] = useState<number | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (totalEntradas !== null && totalSaidas !== null) {
      setSaldo(totalEntradas - totalSaidas)
      setErro(null)
    } else {
      setSaldo(null)
      setErro('Erro ao consultar saldo total')
    }
  }, [totalEntradas, totalSaidas])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const renderConteudo = () => {
    if (erro) {
      return <span style={{ fontSize: '0.9rem', color: '#dc3545' }}>{erro}</span>
    }

    if (saldo !== null) {
      return formatCurrency(saldo)
    }

    return <span>Carregando...</span>
  }

  return (
    <Col md={3}>
      <Card className="text-center h-100" style={{ borderLeft: '4px solid #007bff' }}>
        <Card.Body>
          <Card.Title style={{ color: '#007bff', fontSize: '1rem', fontWeight: 'normal' }}>
            Saldo Total
          </Card.Title>
          <Card.Text className="h4 mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
            {renderConteudo()}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default SaldoTotal
