import React, { useState, useEffect } from 'react'
import { Card, Col } from 'react-bootstrap'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DadosFinanceiros, DistribuicaoFinanceiraProps } from '../types/distribuicaoFinanceira'

const DistribuicaoFinanceira: React.FC<DistribuicaoFinanceiraProps> = ({
  totalEntradas,
  totalSaidas
}) => {
  const [dados, setDados] = useState<DadosFinanceiros[]>([])
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (totalEntradas !== null && totalSaidas !== null) {
      setDados([
        { nome: 'Entradas', valor: totalEntradas, cor: '#28a745' },
        { nome: 'Saídas', valor: totalSaidas, cor: '#dc3545' }
      ])
      setErro(null)
    } else {
      setDados([])
      setErro('Erro ao carregar dados financeiros')
    }
  }, [totalEntradas, totalSaidas])

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
    <Col md={6}>
      <Card className="h-100">
        <Card.Header>
          <Card.Title style={{ fontSize: '1.1rem', color: '#333', margin: 0 }}>
            Distribuição Financeira
          </Card.Title>
        </Card.Header>
        <Card.Body className="d-flex align-items-center justify-content-center">
          {erro ? (
            <div className="text-center text-muted">
              <p>{erro}</p>
            </div>
          ) : dados.length === 0 ? (
            <div className="text-center text-muted">
              <p>Carregando dados...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dados}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="valor"
                  nameKey="nome"
                  label={false}
                >
                  {dados.map((entrada, index) => (
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
          )}
        </Card.Body>
      </Card>
    </Col>
  )
}

export default DistribuicaoFinanceira
