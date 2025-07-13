import React, { useState, useEffect } from 'react'
import { Card, Col } from 'react-bootstrap'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import dashboardService from '../services/dashboard.service'
import { MovimentacaoDay } from '../types/dashboard'
import { MovimentacaoDiariaChart } from '../types/movimentacaoDiaria'

const MovimentacaoDiaria: React.FC = () => {
  const [dados, setDados] = useState<MovimentacaoDiariaChart[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mesAtual, setMesAtual] = useState('')

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true)
        setErro(null)

        // Buscar dados da API
        const movimentacao = await dashboardService.buscarMovimentacaoDiaria()

        // Converter para formato do recharts
        const dadosFormatados: MovimentacaoDiariaChart[] = movimentacao.map((dia: MovimentacaoDay) => ({
          data: dia.dia,
          entradas: dia.total_entradas,
          saidas: dia.total_saidas
        }))

        setDados(dadosFormatados)
        setMesAtual(dashboardService.getMesAtual())
      } catch (error) {
        const mensagemErro = error instanceof Error ? error.message : 'Erro ao consultar movimentação diária'
        setErro(mensagemErro)
        setDados([])
      } finally {
        setLoading(false)
      }
    }

    buscarDados()
  }, [])

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
            Movimentação Diária - {mesAtual}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
              <span>Carregando dados...</span>
            </div>
          ) : erro ? (
            <div className="d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
              <span className="text-muted">{erro}</span>
            </div>
          ) : (
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
          )}
        </Card.Body>
      </Card>
    </Col>
  )
}

export default MovimentacaoDiaria
