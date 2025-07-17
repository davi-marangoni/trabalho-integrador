import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  isAbastecimento?: boolean;
  isCtre?: boolean;
  dadosAbastecimento?: {
    postoGasolina: string;
    tipoCombustivel: string;
    valorUnidade: number;
    quantidadeLitros: number;
    valorTotal: number;
    quilometrosRodados: number;
  };
  dadosCtre?: {
    numeroConhecimento: string;
    serieConhecimento: string;
  };
}

interface TipoLancamento {
  id: number;
  descricao: string;
  tipo: number;
}

interface Veiculo {
  placa: string;
  modelo: string;
}

const EntryValuesForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEditing = Boolean(id)
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
    placaVeiculo: '',
    isAbastecimento: false,
    isCtre: false
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

  // Buscar dados do lançamento para edição
  const fetchLancamentoData = async (lancamentoId: string) => {
    try {
      setLoading(true)
      const result = await servicoApi.get<RespostaApi<any>>(`/lancamentos/${lancamentoId}`)

      if (result.success && result.data) {
        const lancamento = result.data

        setFormData({
          valor: lancamento.valor,
          data: lancamento.data,
          arquivo: null,
          idTipoLancamento: lancamento.idTipoLancamento,
          placaVeiculo: lancamento.placaVeiculo,
          isAbastecimento: lancamento.tipoLancamento === 'abastecimento',
          isCtre: lancamento.tipoLancamento === 'ctre',
          dadosAbastecimento: lancamento.tipoLancamento === 'abastecimento' ? {
            postoGasolina: lancamento.postoGasolina || '',
            tipoCombustivel: lancamento.tipoCombustivel || '',
            valorUnidade: lancamento.valorUnidade || 0,
            quantidadeLitros: lancamento.quantidadeLitros || 0,
            valorTotal: lancamento.valorTotal || 0,
            quilometrosRodados: lancamento.quilometrosRodados || 0
          } : undefined,
          dadosCtre: lancamento.tipoLancamento === 'ctre' ? {
            numeroConhecimento: lancamento.numeroConhecimento || '',
            serieConhecimento: lancamento.serieConhecimento || ''
          } : undefined
        })
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar dados do lançamento')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTiposLancamento()
    fetchVeiculos()
    if (isEditing && id) {
      fetchLancamentoData(id)
    }
  }, [isEditing, id])

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type, checked } = e.target

  if (type === 'checkbox') {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
      // Limpar dados específicos quando desmarca
      ...(name === 'isAbastecimento' && !checked ? { dadosAbastecimento: undefined } : {}),
      ...(name === 'isCtre' && !checked ? { dadosCtre: undefined } : {})
    }))
  } else if (name.startsWith('abastecimento_')) {
    const fieldName = name.replace('abastecimento_', '')
    setFormData(prev => ({
      ...prev,
      dadosAbastecimento: {
        ...prev.dadosAbastecimento,
        [fieldName]: type === 'number' ? parseFloat(value) || 0 : value
      } as any
    }))
  } else if (name.startsWith('ctre_')) {
    const fieldName = name.replace('ctre_', '')
    setFormData(prev => ({
      ...prev,
      dadosCtre: {
        ...prev.dadosCtre,
        [fieldName]: value
      } as any
    }))
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }))
  }
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

      const dadosParaEnvio = {
        valor: formData.valor,
        data: formData.data,
        idTipoLancamento: formData.idTipoLancamento,
        placaVeiculo: formData.placaVeiculo,
        emailUsuarioAdicionou: usuario?.email || '',
        isAbastecimento: formData.isAbastecimento || false,
        isCtre: formData.isCtre || false,
        dadosAbastecimento: formData.isAbastecimento ? formData.dadosAbastecimento : undefined,
        dadosCtre: formData.isCtre ? formData.dadosCtre : undefined
      }

      let response
      if (isEditing) {
        response = await servicoApi.put<RespostaApi<{ id: number }>>(`/lancamentos/${id}`, dadosParaEnvio)
      } else {
        response = await servicoApi.post<RespostaApi<{ id: number }>>('/lancamentos', dadosParaEnvio)
      }

      if (response.success) {
        setSucesso(isEditing ? 'Lançamento atualizado com sucesso!' : 'Lançamento cadastrado com sucesso!')
        setTimeout(() => {
          navigate('/lancamentos')
        }, 2000)
      }
    } catch (error: any) {
      setErro(error.response?.data?.message || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} lançamento`)
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
              <h1>{isEditing ? 'Editar Lançamento' : 'Novo Lançamento'}</h1>
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
                            <option key={tipo.id} value={tipo.id}>
                              {tipo.descricao}
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
                          disabled={isEditing} // Não permite alterar arquivo na edição
                        />
                        <Form.Text className="text-muted">
                          Formatos aceitos: PDF, JPG, JPEG, PNG
                          {isEditing && ' (não é possível alterar o arquivo na edição)'}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Seção de tipo específico do lançamento */}
                  <Row>
                    <Col md={12}>
                      <h6 className="text-muted mb-3 border-top pt-3">Tipo Específico do Lançamento</h6>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          name="isAbastecimento"
                          label="É um abastecimento"
                          checked={formData.isAbastecimento || false}
                          onChange={handleInputChange}
                          disabled={formData.isCtre} // Desabilita se CTRE estiver marcado
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          name="isCtre"
                          label="É um CT-e"
                          checked={formData.isCtre || false}
                          onChange={handleInputChange}
                          disabled={formData.isAbastecimento} // Desabilita se abastecimento estiver marcado
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Campos específicos para abastecimento */}
                  {formData.isAbastecimento && (
                    <div className="border rounded p-3 mb-3 bg-light">
                      <h6 className="text-primary mb-3">Dados do Abastecimento</h6>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Posto de Gasolina</Form.Label>
                            <Form.Control
                              type="text"
                              name="abastecimento_postoGasolina"
                              value={formData.dadosAbastecimento?.postoGasolina || ''}
                              onChange={handleInputChange}
                              placeholder="Nome do posto"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Tipo de Combustível</Form.Label>
                            <Form.Select
                              name="abastecimento_tipoCombustivel"
                              value={formData.dadosAbastecimento?.tipoCombustivel || ''}
                              onChange={(e) => handleInputChange(e as any)}
                            >
                              <option value="">Selecione</option>
                              <option value="Gasolina">Gasolina</option>
                              <option value="Etanol">Etanol</option>
                              <option value="Diesel">Diesel</option>
                              <option value="GNV">GNV</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Valor Unitário (R$)</Form.Label>
                            <Form.Control
                              type="number"
                              name="abastecimento_valorUnidade"
                              value={formData.dadosAbastecimento?.valorUnidade || ''}
                              onChange={handleInputChange}
                              step="0.001"
                              min="0"
                              placeholder="0.000"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Quantidade (Litros)</Form.Label>
                            <Form.Control
                              type="number"
                              name="abastecimento_quantidadeLitros"
                              value={formData.dadosAbastecimento?.quantidadeLitros || ''}
                              onChange={handleInputChange}
                              step="0.001"
                              min="0"
                              placeholder="0.000"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Valor Total (R$)</Form.Label>
                            <Form.Control
                              type="number"
                              name="abastecimento_valorTotal"
                              value={formData.dadosAbastecimento?.valorTotal || ''}
                              onChange={handleInputChange}
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Quilômetros Rodados</Form.Label>
                            <Form.Control
                              type="number"
                              name="abastecimento_quilometrosRodados"
                              value={formData.dadosAbastecimento?.quilometrosRodados || ''}
                              onChange={handleInputChange}
                              min="0"
                              placeholder="0"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {/* Campos específicos para CT-e */}
                  {formData.isCtre && (
                    <div className="border rounded p-3 mb-3 bg-light">
                      <h6 className="text-success mb-3">Dados do Conhecimento de Transporte</h6>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Número do Conhecimento</Form.Label>
                            <Form.Control
                              type="text"
                              name="ctre_numeroConhecimento"
                              value={formData.dadosCtre?.numeroConhecimento || ''}
                              onChange={handleInputChange}
                              placeholder="Número do CT-e"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Série do Conhecimento</Form.Label>
                            <Form.Control
                              type="text"
                              name="ctre_serieConhecimento"
                              value={formData.dadosCtre?.serieConhecimento || ''}
                              onChange={handleInputChange}
                              placeholder="Série do CT-e"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}

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
                        isEditing ? 'Atualizar' : 'Cadastrar'
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
