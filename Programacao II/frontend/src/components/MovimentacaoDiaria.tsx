import React from 'react'
import { Card, Col } from 'react-bootstrap'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface MovimentacaoDiaria {
  data: string
  entradas: number
  saidas: number
}

interface MovimentacaoDiariaProps {
  dados: MovimentacaoDiaria[]
}

const MovimentacaoDiaria: React.FC<MovimentacaoDiariaProps> = ({ dados }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <Col md={6}>
      <Card className="h-100">
        <Card.Header>
          <Card.Title style={{ fontSize: '1.1rem', color: '#333', margin: 0 }}>
            Movimentação Diária - junho 2025
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dados}>
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
  )
}

export default MovimentacaoDiaria
