import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { servicoApi } from '../services/api'
import { RespostaApi } from '../types'
import { useAuth } from '../hooks/useAuth'

interface EntryFormData {
  valor: number;
  data: string;
  arquivo?: File | null;
  idTipoLancamento: number;
  placaVeiculo: string;
}

interface TipoLancamento {
  tipl_codigo: number;
  tipl_descricao: string;
  tipl_tipo: number;
}

interface Veiculo {
  placa: string;
  modelo: string;
}

const EntryValuesForm: React.FC = () => {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)
  const [tiposLancamento, setTiposLancamento] = useState<TipoLancamento[]>([])
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])

  const [formData, setFormData] = useState<EntryFormData>({
    valor: 0,
    data: new Date().toISOString().split('T')[0],
    arquivo: null,
    idTipoLancamento: 0,
    placaVeiculo: ''
  })

  // Buscar tipos de lançamento
 const fetchTiposLancamento = async () => {
  try {
    const response = await servicoApi.get<RespostaApi<TipoLancamento[]>>('/tipolancamentos')
    if (response.success && response.data) {
      setTiposLancamento(response.data || []) // Add fallback empty array
    }
  } catch (error) {
    console.error('Erro ao buscar tipos de lançamento:', error)
    setTiposLancamento([]) // Set empty array on error
  }
}
  // Buscar veículos
  const fetchVeiculos = async () => {
  try {
    const response = await servicoApi.get<RespostaApi<Veiculo[]>>('/veiculos')
    if (response.success && response.data) {
      setVeiculos(response.data || []) // Add fallback empty array
    }
  } catch (error) {
    console.error('Erro ao buscar veículos:', error)
    setVeiculos([]) // Set empty array on error
  }
}

  useEffect(() => {
    fetchTiposLancamento()
    fetchVeiculos()
  }, [])

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: type === 'number' ? parseFloat(value) : value
  }))
}
const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: name === 'idTipoLancamento' ? parseInt(value) : value
  }))
}

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      arquivo: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.valor || !formData.data || !formData.idTipoLancamento || !formData.placaVeiculo) {
      setErro('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      setLoading(true)
      setErro(null)
      setSucesso(null)

      // Criar FormData se houver arquivo
      const dados = new FormData()
      dados.append('valor', formData.valor.toString())
      dados.append('data', formData.data)
      dados.append('idTipoLancamento', formData.idTipoLancamento.toString())
      dados.append('placaVeiculo', formData.placaVeiculo)
      dados.append('emailUsuario', usuario?.email || '')

      if (formData.arquivo) {
        dados.append('arquivo', formData.arquivo)
      }

      const response = await servicoApi.post<RespostaApi<{ id: number }>>('/lancamentos', dados)

      if (response.success) {
        setSucesso('Lançamento cadastrado com sucesso!')
        setTimeout(() => {
          navigate('/lancamentos')
        }, 2000)
      }
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao cadastrar lançamento')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/lancamentos')
  }

  return (
    <div className="entry-form-container">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h1>Novo Lançamento</h1>
              <Button
                variant="outline-secondary"
                onClick={handleCancel}
                className="d-flex align-items-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Voltar
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
              <Alert variant="success">{sucesso}</Alert>
            </Col>
          </Row>
        )}

        <Row>
          <Col xs={12} md={8} lg={6} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title>Dados do Lançamento</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tipo de Lançamento *</Form.Label>
                        <Form.Select
                          name="idTipoLancamento"
                          value={formData.idTipoLancamento}
                          onChange={handleSelectChange}
                          required
                        >
                          <option value="">Selecione um tipo</option>
                          {tiposLancamento.map(tipo => (
                            <option key={tipo.tipl_codigo} value={tipo.tipl_codigo}>
                              {tipo.tipl_descricao}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Veículo *</Form.Label>
                        <Form.Select
                          name="placaVeiculo"
                          value={formData.placaVeiculo}
                          onChange={handleSelectChange}
                          required
                        >
                          <option value="">Selecione um veículo</option>
                          {veiculos.map(veiculo => (
                            <option key={veiculo.placa} value={veiculo.placa}>
                              {veiculo.placa} - {veiculo.modelo}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Valor *</Form.Label>
                        <Form.Control
                          type="number"
                          name="valor"
                          value={formData.valor}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Data *</Form.Label>
                        <Form.Control
                          type="date"
                          name="data"
                          value={formData.data}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Comprovante</Form.Label>
                        <Form.Control
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <Form.Text className="text-muted">
                          Formatos aceitos: PDF, JPG, JPEG, PNG
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Salvando...</span>
                          </div>
                          Salvando...
                        </>
                      ) : (
                        'Cadastrar'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
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

export default EntryValuesForm
