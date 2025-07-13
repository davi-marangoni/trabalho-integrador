import React, { useState, useEffect } from 'react'
import { Card, Col } from 'react-bootstrap'
import dashboardService from '../services/dashboard.service'
import { TotalSaidasProps } from '../types/totalSaidas'

const TotalSaidas: React.FC<TotalSaidasProps> = ({ onValueChange }) => {
  const [valor, setValor] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true)
        setErro(null)
        const totalSaidas = await dashboardService.buscarTotalSaidas()
        setValor(totalSaidas)
        onValueChange?.(totalSaidas)
      } catch (error) {
        const mensagemErro = error instanceof Error ? error.message : 'Erro ao consultar valor de total de saídas'
        setErro(mensagemErro)
        setValor(null)
        onValueChange?.(null)
      } finally {
        setLoading(false)
      }
    }

    buscarDados()
  }, [onValueChange])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const renderConteudo = () => {
    if (loading) {
      return <span>Carregando...</span>
    }

    if (erro) {
      return <span style={{ fontSize: '0.9rem', color: '#dc3545' }}>{erro}</span>
    }

    if (valor !== null) {
      return formatCurrency(valor)
    }

    return <span>-</span>
  }

  return (
    <Col md={3}>
      <Card className="text-center h-100" style={{ borderLeft: '4px solid #dc3545' }}>
        <Card.Body>
          <Card.Title style={{ color: '#dc3545', fontSize: '1rem', fontWeight: 'normal' }}>
            Total de Saídas
          </Card.Title>
          <Card.Text className="h4 mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
            {renderConteudo()}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default TotalSaidas
