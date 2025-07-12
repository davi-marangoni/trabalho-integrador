import React, { useState, useEffect } from 'react'
import { Card, Col } from 'react-bootstrap'
import servicoApi from '../services/api'

const VeiculosAtivos: React.FC = () => {
  const [veiculosAtivos, setVeiculosAtivos] = useState<number>(0)
  const [carregandoVeiculos, setCarregandoVeiculos] = useState<boolean>(true)

  useEffect(() => {
    const buscarVeiculosAtivos = async () => {
      try {
        setCarregandoVeiculos(true)
        const resposta = await servicoApi.get<{
          success: boolean
          data: { count: number }
          message: string
        }>('/veiculos/situacaocount?situacao=A')
        setVeiculosAtivos(resposta.data.count)
      } catch (error) {
        console.error('Erro ao buscar veículos ativos:', error)
        setVeiculosAtivos(0)
      } finally {
        setCarregandoVeiculos(false)
      }
    }

    buscarVeiculosAtivos()
  }, [])

  return (
    <Col md={3}>
      <Card className="text-center h-100" style={{ borderLeft: '4px solid #17a2b8' }}>
        <Card.Body>
          <Card.Title style={{ color: '#17a2b8', fontSize: '1rem', fontWeight: 'normal' }}>
            Veículos Ativos
          </Card.Title>
          <Card.Text className="h4 mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
            {carregandoVeiculos ? 'Carregando...' : veiculosAtivos}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default VeiculosAtivos
