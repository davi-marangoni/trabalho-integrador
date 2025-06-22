import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

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
  const veiculosAtivos = 3

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatTooltipValue = (value: number) => {
    return formatCurrency(value)
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h1>Dashboard</h1>
        </Col>
      </Row>

      {/* Cards de Métricas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100" style={{ borderLeft: '4px solid #28a745' }}>
            <Card.Body>
              <Card.Title style={{ color: '#28a745', fontSize: '1rem', fontWeight: 'normal' }}>
                Total de Entradas
              </Card.Title>
              <Card.Text className="h4 mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
                {formatCurrency(totalEntradas)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100" style={{ borderLeft: '4px solid #dc3545' }}>
            <Card.Body>
              <Card.Title style={{ color: '#dc3545', fontSize: '1rem', fontWeight: 'normal' }}>
                Total de Saídas
              </Card.Title>
              <Card.Text className="h4 mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
                {formatCurrency(totalSaidas)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100" style={{ borderLeft: '4px solid #007bff' }}>
            <Card.Body>
              <Card.Title style={{ color: '#007bff', fontSize: '1rem', fontWeight: 'normal' }}>
                Saldo Total
              </Card.Title>
              <Card.Text className="h4 mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
                {formatCurrency(saldoTotal)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100" style={{ borderLeft: '4px solid #17a2b8' }}>
            <Card.Body>
              <Card.Title style={{ color: '#17a2b8', fontSize: '1rem', fontWeight: 'normal' }}>
                Veículos Ativos
              </Card.Title>
              <Card.Text className="h4 mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
                {veiculosAtivos}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>
              <Card.Title style={{ fontSize: '1.1rem', color: '#333', margin: 0 }}>
                Distribuição Financeira
              </Card.Title>
            </Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockDadosFinanceiros}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="valor"
                    nameKey="nome"
                    label={false}
                  >
                    {mockDadosFinanceiros.map((entrada, index) => (
                      <Cell key={`cell-${index}`} fill={entrada.cor} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [formatTooltipValue(value), name]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="square"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>
              <Card.Title style={{ fontSize: '1.1rem', color: '#333', margin: 0 }}>
                Movimentação Diária - junho 2025
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockMovimentacaoDiaria}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="data"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === 'entradas' ? 'Entradas' : 'Saídas'
                    ]}
                    labelStyle={{ color: '#333' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="line"
                    wrapperStyle={{ paddingTop: '10px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="entradas"
                    stroke="#28a745"
                    strokeWidth={2}
                    dot={{ fill: '#28a745', strokeWidth: 2, r: 4 }}
                    name="Entradas"
                  />
                  <Line
                    type="monotone"
                    dataKey="saidas"
                    stroke="#dc3545"
                    strokeWidth={2}
                    dot={{ fill: '#dc3545', strokeWidth: 2, r: 4 }}
                    name="Saídas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  )
}

export default Dashboard
