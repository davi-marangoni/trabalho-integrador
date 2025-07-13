import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'

import { servicoApi } from '../services/api'
import { VeiculoParaSelecao, NovaFrota } from '../types'

const FrotaForm: React.FC = () => {
  const navigate = useNavigate()
  const [cavalos, setCavalos] = useState<VeiculoParaSelecao[]>([])
  const [carretas, setCarretas] = useState<VeiculoParaSelecao[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCavalos, setLoadingCavalos] = useState(true)
  const [loadingCarretas, setLoadingCarretas] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  const [formData, setFormData] = useState<NovaFrota>({
    placaCavalo: '',
    placaCarreta: ''
  })

  // Função para buscar cavalos disponíveis (tipo 5, situação A)
  const fetchCavalos = async () => {
    try {
      setLoadingCavalos(true)
      const result = await servicoApi.get<{ success: boolean; data: VeiculoParaSelecao[]; message: string }>('/veiculos?tipo=5&situacao=A')

      if (result.success) {
        setCavalos(result.data)
      } else {
        setErro(result.message)
      }
    } catch (error: any) {
      setErro(error.message || 'Erro ao buscar cavalos')
    } finally {
      setLoadingCavalos(false)
    }
  }

  // Função para buscar carretas disponíveis (tipo 6, situação A)
  const fetchCarretas = async () => {
    try {
      setLoadingCarretas(true)
      const result = await servicoApi.get<{ success: boolean; data: VeiculoParaSelecao[]; message: string }>('/veiculos?tipo=6&situacao=A')

      if (result.success) {
        setCarretas(result.data)
      } else {
        setErro(result.message)
      }
    } catch (error: any) {
      setErro(error.message || 'Erro ao buscar carretas')
    } finally {
      setLoadingCarretas(false)
    }
  }

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Função para submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.placaCavalo || !formData.placaCarreta) {
      setErro('Por favor, selecione tanto o cavalo quanto a carreta')
      return
    }

    try {
      setLoading(true)
      setErro(null)
      setSucesso(null)

      const result = await servicoApi.post<{ success: boolean; data: { id: number }; message: string }>('/frotas', formData)

      if (result.success) {
        setSucesso(result.message)
        // Redireciona para a lista de frotas após sucesso com um delay para mostrar a mensagem
        setTimeout(() => {
          navigate('/frotas')
        }, 2000)
      }
    } catch (error: any) {
      setErro(error.message || 'Erro ao cadastrar frota')
    } finally {
      setLoading(false)
    }
  }

  // Função para cancelar e voltar à lista
  const handleCancel = () => {
    navigate('/frotas')
  }

  useEffect(() => {
    fetchCavalos()
    fetchCarretas()
  }, [])

  return (
    <div className="frota-form-container">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h1>Cadastrar Nova Frota</h1>
              <Button variant="secondary" onClick={handleCancel}>
                Voltar à Lista
              </Button>
            </div>
          </Col>
        </Row>

        {erro && (
          <Row className="mb-3">
            <Col>
              <Alert variant="danger" onClose={() => setErro(null)} dismissible>
                {erro}
              </Alert>
            </Col>
          </Row>
        )}

        {sucesso && (
          <Row className="mb-3">
            <Col>
              <Alert variant="success">
                {sucesso}
              </Alert>
            </Col>
          </Row>
        )}

        <Row>
          <Col md={8} lg={6}>
            <Card>
              <Card.Header>
                <Card.Title>Dados da Frota</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Placa do Cavalo *</Form.Label>
                        <Form.Select
                          name="placaCavalo"
                          value={formData.placaCavalo}
                          onChange={handleInputChange}
                          required
                          disabled={loadingCavalos}
                        >
                          <option value="">
                            {loadingCavalos ? 'Carregando cavalos...' : 'Selecione um cavalo'}
                          </option>
                          {cavalos.map((cavalo) => (
                            <option key={cavalo.placa} value={cavalo.placa}>
                              {cavalo.placa} - {cavalo.modelo} ({cavalo.ano})
                            </option>
                          ))}
                        </Form.Select>
                        {loadingCavalos && (
                          <Form.Text className="text-muted">
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Carregando...</span>
                            </div>
                            Carregando cavalos disponíveis...
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Placa da Carreta *</Form.Label>
                        <Form.Select
                          name="placaCarreta"
                          value={formData.placaCarreta}
                          onChange={handleInputChange}
                          required
                          disabled={loadingCarretas}
                        >
                          <option value="">
                            {loadingCarretas ? 'Carregando carretas...' : 'Selecione uma carreta'}
                          </option>
                          {carretas.map((carreta) => (
                            <option key={carreta.placa} value={carreta.placa}>
                              {carreta.placa} - {carreta.modelo} ({carreta.ano})
                            </option>
                          ))}
                        </Form.Select>
                        {loadingCarretas && (
                          <Form.Text className="text-muted">
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Carregando...</span>
                            </div>
                            Carregando carretas disponíveis...
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading || loadingCavalos || loadingCarretas}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Salvando...</span>
                          </div>
                          Salvando...
                        </>
                      ) : (
                        'Cadastrar Frota'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FrotaForm
