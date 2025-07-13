import React, { useState, useEffect } from 'react'
import { Card, Col } from 'react-bootstrap'
import dashboardService from '../services/dashboard.service'

const VeiculosAtivos: React.FC = () => {
  const [valor, setValor] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true)
        setErro(null)
        const veiculosAtivos = await dashboardService.buscarVeiculosAtivos()
        setValor(veiculosAtivos)
      } catch (error) {
        const mensagemErro = error instanceof Error ? error.message : 'Erro ao consultar veículos ativos'
        setErro(mensagemErro)
        setValor(null)
      } finally {
        setLoading(false)
      }
    }

    buscarDados()
  }, [])

  const renderConteudo = () => {
    if (loading) {
      return <span>Carregando...</span>
    }

    if (erro) {
      return <span style={{ fontSize: '0.9rem', color: '#dc3545' }}>{erro}</span>
    }

    if (valor !== null) {
      return valor
    }

    return <span>-</span>
  }

  return (
    <Col md={3}>
      <Card className="text-center h-100" style={{ borderLeft: '4px solid #17a2b8' }}>
        <Card.Body>
          <Card.Title style={{ color: '#17a2b8', fontSize: '1rem', fontWeight: 'normal' }}>
            Veículos Ativos
          </Card.Title>
          <Card.Text className="h4 mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
            {renderConteudo()}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default VeiculosAtivos
