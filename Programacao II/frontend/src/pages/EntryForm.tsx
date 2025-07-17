import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { servicoApi } from '../services/api'
import { RespostaApi } from '../types'

interface EntryTypeFormData {
  descricao: string
  tipo: number // 1 - Entrada, 2 - Saída
}

const EntryTypeForm: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  const [formData, setFormData] = useState<EntryTypeFormData>({
    descricao: '',
    tipo: 1
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: name === 'tipo' ? parseInt(value) : value
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

    if (!formData.descricao || !formData.tipo) {
      setErro('Por favor, preencha todos os campos')
      return
    }

    try {
      setLoading(true)
      setErro(null)
      setSucesso(null)

      const result = await servicoApi.post<RespostaApi<{ id: number }>>('/tipolancamentos', formData)

      if (result.success) {
        setSucesso('Tipo de lançamento cadastrado com sucesso!')
        // Redireciona após 2 segundos
        setTimeout(() => {
          navigate('/tipolancamentos')
        }, 2000)
      }
    } catch (error: any) {
      setErro(error.message || 'Erro ao cadastrar tipo de lançamento')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/tipolancamentos')
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
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleInputChange}
                            required
                          />
                            <Form.Select
                              name="tipo"
                              value={formData.tipo}
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
