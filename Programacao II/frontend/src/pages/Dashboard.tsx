import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import TotalEntradas from '../components/TotalEntradas'
import TotalSaidas from '../components/TotalSaidas'
import SaldoTotal from '../components/SaldoTotal'
import VeiculosAtivos from '../components/VeiculosAtivos'
import DistribuicaoFinanceira from '../components/DistribuicaoFinanceira'
import MovimentacaoDiaria from '../components/MovimentacaoDiaria'

const Dashboard: React.FC = () => {
  const [totalEntradas, setTotalEntradas] = useState<number | null>(null)
  const [totalSaidas, setTotalSaidas] = useState<number | null>(null)

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h1>Dashboard</h1>
        </Col>
      </Row>

      {/* Cards de Métricas */}
      <Row className="mb-4">
        <TotalEntradas onValueChange={setTotalEntradas} />
        <TotalSaidas onValueChange={setTotalSaidas} />
        <SaldoTotal totalEntradas={totalEntradas} totalSaidas={totalSaidas} />
        <VeiculosAtivos />
      </Row>

      {/* Gráficos */}
      <Row>
        <DistribuicaoFinanceira totalEntradas={totalEntradas} totalSaidas={totalSaidas} />
        <MovimentacaoDiaria />
      </Row>
    </Container>
  )
}

export default Dashboard
