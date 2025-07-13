import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { servicoApi } from '../services/api'
import { TipoVeiculo } from '../types'

interface VehicleFormData {
  placa: string
  modelo: string
  renavam: string
  situacao: string
  tipo: number
  ano: number
  // Campos específicos para tipos especiais
  trucado?: boolean
  marcaEquipamentoFrio?: string
  anoEquipamentoFrio?: number
  quantidadePaletes?: number
}

const VehicleForm: React.FC = () => {
  const navigate = useNavigate()
  const { placa } = useParams<{ placa?: string }>()
  const isEditing = Boolean(placa)

  const [formData, setFormData] = useState<VehicleFormData>({
    placa: '',
    modelo: '',
    renavam: '',
    situacao: 'A',
    tipo: 1,
    ano: new Date().getFullYear(),
  })

  const [tiposVeiculo, setTiposVeiculo] = useState<TipoVeiculo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Buscar tipos de veículos
  const fetchTiposVeiculos = async () => {
    try {
      const result = await servicoApi.get<{ success: boolean; data: TipoVeiculo[]; message: string }>('/veiculos/tipos')
      if (result.success) {
        setTiposVeiculo(result.data)
      }
    } catch (error) {
      console.error('Erro ao buscar tipos de veículos:', error)
    }
  }

  // Buscar dados do veículo para edição
  const fetchVehicleData = async (vehiclePlaca: string) => {
    try {
      setLoading(true)
      const result = await servicoApi.get<{ success: boolean; data: any; message: string }>(`/veiculos/${vehiclePlaca}`)

      if (result.success) {
        const vehicleData = result.data
        setFormData({
          placa: vehicleData.placa,
          modelo: vehicleData.modelo,
          renavam: vehicleData.renavam,
          situacao: vehicleData.situacao,
          tipo: vehicleData.tipo,
          ano: vehicleData.ano,
          trucado: vehicleData.trucado,
          marcaEquipamentoFrio: vehicleData.marcaEquipamentoFrio,
          anoEquipamentoFrio: vehicleData.anoEquipamentoFrio,
          quantidadePaletes: vehicleData.quantidadePaletes,
        })
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar dados do veículo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTiposVeiculos()
    if (isEditing && placa) {
      fetchVehicleData(placa)
    }
  }, [isEditing, placa])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checkboxValue = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checkboxValue
      }))
    } else {
      let processedValue = value

      // Processar placa: maiúsculo e manter apenas letras e números
      if (name === 'placa') {
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
      }

      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' || name === 'tipo' || name === 'ano' || name === 'anoEquipamentoFrio' || name === 'quantidadePaletes' ? Number(processedValue) : processedValue
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const dataToSend: any = {
        placa: formData.placa,
        modelo: formData.modelo,
        renavam: formData.renavam,
        situacao: formData.situacao,
        tipo: formData.tipo,
        ano: formData.ano,
        idFrota: null, // Sempre null no cadastro conforme requisito
      }

      // Adicionar campos específicos baseado no tipo
      if (formData.tipo === 5) { // Cavalinho
        dataToSend.trucado = formData.trucado || false
      } else if (formData.tipo === 6) { // Carreta Frigorificada
        dataToSend.marcaEquipamentoFrio = formData.marcaEquipamentoFrio || ''
        dataToSend.anoEquipamentoFrio = formData.anoEquipamentoFrio || new Date().getFullYear()
        dataToSend.quantidadePaletes = formData.quantidadePaletes || 0
      }

      if (isEditing) {
        // Para edição, verificar campos alterados
        const changedData: any = {}

        // Obter dados originais do veículo
        const originalResponse = await servicoApi.get<{ success: boolean; data: any; message: string }>(`/veiculos/${placa}`)
        const originalData = originalResponse.data

        // Comparar campos básicos
        if (dataToSend.modelo !== originalData.modelo) changedData.modelo = dataToSend.modelo
        if (dataToSend.renavam !== originalData.renavam) changedData.renavam = dataToSend.renavam
        if (dataToSend.situacao !== originalData.situacao) changedData.situacao = dataToSend.situacao
        if (dataToSend.ano !== originalData.ano) changedData.ano = dataToSend.ano

        // Comparar campos específicos
        if (formData.tipo === 5) {
          if (dataToSend.trucado !== originalData.trucado) changedData.trucado = dataToSend.trucado
        } else if (formData.tipo === 6) {
          if (dataToSend.marcaEquipamentoFrio !== originalData.marcaEquipamentoFrio) {
            changedData.marcaEquipamentoFrio = dataToSend.marcaEquipamentoFrio
          }
          if (dataToSend.anoEquipamentoFrio !== originalData.anoEquipamentoFrio) {
            changedData.anoEquipamentoFrio = dataToSend.anoEquipamentoFrio
          }
          if (dataToSend.quantidadePaletes !== originalData.quantidadePaletes) {
            changedData.quantidadePaletes = dataToSend.quantidadePaletes
          }
        }

        if (Object.keys(changedData).length === 0) {
          setError('Nenhum campo foi alterado')
          return
        }

        await servicoApi.put(`/veiculos/${placa}`, changedData)
        setSuccess('Veículo atualizado com sucesso!')
      } else {
        await servicoApi.post('/veiculos', dataToSend)
        setSuccess('Veículo cadastrado com sucesso!')
      }

      // Redirecionar após sucesso
      setTimeout(() => {
        navigate('/veiculos')
      }, 2000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao salvar veículo')
    } finally {
      setLoading(false)
    }
  }

  // Gerar anos para seleção
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  // Verificar se o tipo selecionado tem campos específicos (calculado a cada render)
  const getTipoSelecionado = () => tiposVeiculo.find(t => t.id === formData.tipo)
  const temCamposEspecificos = getTipoSelecionado()?.temAtributosEspecificos || false

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>{isEditing ? 'Editar Veículo' : 'Cadastrar Veículo'}</h1>
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/veiculos')}
              className="d-flex align-items-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Voltar
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={11} lg={10} xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>{isEditing ? 'Dados do Veículo' : 'Novo Veículo'}</Card.Title>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Campos obrigatórios para todos os veículos */}
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Placa *</Form.Label>
                      <Form.Control
                        type="text"
                        name="placa"
                        value={formData.placa}
                        onChange={handleInputChange}
                        required
                        disabled={isEditing}
                        placeholder="ABC1234"
                        maxLength={8}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo *</Form.Label>
                      <Form.Select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        required
                      >
                        {tiposVeiculo.map(tipo => (
                          <option key={tipo.id} value={tipo.id}>
                            {tipo.nome}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Situação *</Form.Label>
                      <Form.Select
                        name="situacao"
                        value={formData.situacao}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="A">Ativo</option>
                        <option value="I">Inativo</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Modelo</Form.Label>
                      <Form.Control
                        type="text"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleInputChange}
                        placeholder="Ex: Volvo FH"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Renavam</Form.Label>
                      <Form.Control
                        type="text"
                        name="renavam"
                        value={formData.renavam}
                        onChange={handleInputChange}
                        placeholder="12345678901"
                        maxLength={11}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ano</Form.Label>
                      <Form.Select
                        name="ano"
                        value={formData.ano}
                        onChange={handleInputChange}
                      >
                        {years.map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Campos específicos para Cavalinho (tipo 5) */}
                {formData.tipo === 5 && (
                  <div className="border-top pt-3 mt-3">
                    <h6 className="text-muted mb-3">Campos Específicos - Cavalinho</h6>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="trucado"
                        label="Trucado"
                        checked={formData.trucado || false}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>
                )}

                {/* Campos específicos para Carreta Frigorificada (tipo 6) */}
                {formData.tipo === 6 && (
                  <div className="border-top pt-3 mt-3">
                    <h6 className="text-muted mb-3">Campos Específicos - Carreta Frigorificada</h6>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Marca do Equipamento de Frio</Form.Label>
                          <Form.Control
                            type="text"
                            name="marcaEquipamentoFrio"
                            value={formData.marcaEquipamentoFrio || ''}
                            onChange={handleInputChange}
                            placeholder="Ex: Thermo King"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Ano do Equipamento de Frio</Form.Label>
                          <Form.Select
                            name="anoEquipamentoFrio"
                            value={formData.anoEquipamentoFrio || currentYear}
                            onChange={handleInputChange}
                          >
                            {years.map(year => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Quantidade de Paletes</Form.Label>
                          <Form.Control
                            type="number"
                            name="quantidadePaletes"
                            value={formData.quantidadePaletes || 0}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}

                <div className="d-flex gap-2 mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate('/veiculos')}
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
  )
}

export default VehicleForm
