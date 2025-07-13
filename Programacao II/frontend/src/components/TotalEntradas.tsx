import React, { useState, useEffect } from 'react'
import { Card, Col } from 'react-bootstrap'
import dashboardService from '../services/dashboard.service'
import { TotalEntradasProps } from '../types/totalEntradas'

const TotalEntradas: React.FC<TotalEntradasProps> = ({ onValueChange }) => {
  const [valor, setValor] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true)
        setErro(null)
        const totalEntradas = await dashboardService.buscarTotalEntradas()
        setValor(totalEntradas)
        onValueChange?.(totalEntradas)
      } catch (error) {
        const mensagemErro = error instanceof Error ? error.message : 'Erro ao consultar valor de total de entradas'
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
      <Card className="text-center h-100" style={{ borderLeft: '4px solid #28a745' }}>
        <Card.Body>
          <Card.Title style={{ color: '#28a745', fontSize: '1rem', fontWeight: 'normal' }}>
            Total de Entradas
          </Card.Title>
          <Card.Text className="h4 mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
            {renderConteudo()}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default TotalEntradas
