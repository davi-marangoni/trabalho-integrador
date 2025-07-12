import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import TotalEntradas from '../components/TotalEntradas'
import TotalSaidas from '../components/TotalSaidas'
import SaldoTotal from '../components/SaldoTotal'
import VeiculosAtivos from '../components/VeiculosAtivos'
import DistribuicaoFinanceira from '../components/DistribuicaoFinanceira'
import MovimentacaoDiaria from '../components/MovimentacaoDiaria'

const mockDadosFinanceiros = [
  { nome: 'Entradas', valor: 11200, cor: '#28a745' },
  { nome: 'Saídas', valor: 4000, cor: '#dc3545' }
]

const mockMovimentacaoDiaria = [
  { data: '03/06', entradas: 0, saidas: 0 },
  { data: '06/06', entradas: 0, saidas: 0 },
  { data: '09/06', entradas: 0, saidas: 0 },
  { data: '11/06', entradas: 2700, saidas: 3000 },
  { data: '13/06', entradas: 0, saidas: 0 },
  { data: '15/06', entradas: 0, saidas: 0 },
  { data: '17/06', entradas: 0, saidas: 0 },
  { data: '19/06', entradas: 0, saidas: 0 },
  { data: '21/06', entradas: 3200, saidas: 1000 },
  { data: '23/06', entradas: 0, saidas: 0 },
  { data: '25/06', entradas: 5300, saidas: 0 },
  { data: '27/06', entradas: 0, saidas: 0 },
  { data: '30/06', entradas: 0, saidas: 0 }
]

const Dashboard: React.FC = () => {
  const totalEntradas = 11200
  const totalSaidas = 4000
  const saldoTotal = totalEntradas - totalSaidas

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h1>Dashboard</h1>
        </Col>
      </Row>

      {/* Cards de Métricas */}
      <Row className="mb-4">
        <TotalEntradas valor={totalEntradas} />
        <TotalSaidas valor={totalSaidas} />
        <SaldoTotal valor={saldoTotal} />
        <VeiculosAtivos />
      </Row>

      {/* Gráficos */}
      <Row>
        <DistribuicaoFinanceira dados={mockDadosFinanceiros} />
        <MovimentacaoDiaria dados={mockMovimentacaoDiaria} />
      </Row>
    </Container>
  )
}

export default Dashboard
