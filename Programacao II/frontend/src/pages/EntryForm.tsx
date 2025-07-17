import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { servicoApi } from '../services/api'
import { RespostaApi } from '../types'

interface EntryTypeFormData {
  tipl_codigo?: number;
  tipl_descricao: string
  tipl_tipo: number // 1 - Entrada, 2 - Saída
}

const EntryTypeForm: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  const [formData, setFormData] = useState<EntryTypeFormData>({
    tipl_descricao: '',
    tipl_tipo: 1
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: name === 'tipl_tipo' ? parseInt(value) : value
  }))
}

// For the Form.Select, create a separate handler
const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: parseInt(value)
  }))
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.tipl_descricao || !formData.tipl_tipo) {
      setErro('Por favor, preencha todos os campos')
      return
    }

    try {
      setLoading(true)
      setErro(null)
      setSucesso(null)

      console.log('Enviando dados:', formData) // Log dos dados enviados

      const result = await servicoApi.post<RespostaApi<{ tipl_codigo: number }>>('/tipolancamentos', formData)

      console.log('Resposta da API:', result) // Log da resposta

      if (result.success) {
        setSucesso('Tipo de lançamento cadastrado com sucesso!')
        setTimeout(() => {
          navigate('/lancamentos')
        }, 2000)
      }
    } catch (error: any) {
      console.error('Erro detalhado:', error) // Log detalhado do erro
      setErro(
        error.response?.data?.message ||
        error.message ||
        'Erro ao cadastrar tipo de lançamento'
      )
    } finally {
      setLoading(false)
    }
}

  const handleCancel = () => {
    navigate('/lancamentos')
  }

  return (
    <div className="entry-type-form-container">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h1>Cadastrar Novo Tipo de Lançamento</h1>
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
              <Alert variant="success">
                {sucesso}
              </Alert>
            </Col>
          </Row>
        )}

        <Row>
          <Col xs={12} md={8} lg={6} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title>Dados do Tipo de Lançamento</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Descrição *</Form.Label>
                          <Form.Control
                            type="text"
                            name="tipl_descricao"
                            value={formData.tipl_descricao}
                            onChange={handleInputChange}
                            required
                          />
                            <Form.Select
                              name="tipl_tipo"
                              value={formData.tipl_tipo}
                              onChange={handleSelectChange}
                              required
                            >
                              <option value={1}>Entrada</option>
                              <option value={2}>Saída</option>
                            </Form.Select>
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
  variant="secondary"
  onClick={() => console.log('Estado atual:', formData)}
  className="me-2"
>
  Debug
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

export default EntryTypeForm
