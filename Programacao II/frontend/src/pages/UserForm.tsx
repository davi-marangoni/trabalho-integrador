import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'

import { servicoApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { RespostaCriarUsuario } from '../types'

interface UsuarioForm {
  email: string
  senha: string
  tipo: number
}

const UserForm: React.FC = () => {
  const navigate = useNavigate()
  const { usuario: usuarioLogado } = useAuth()
  const [formData, setFormData] = useState<UsuarioForm>({
    email: '',
    senha: '',
    tipo: 2 // Padrão: Operador
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Verifica se o usuário logado é administrador
  useEffect(() => {
    if (usuarioLogado && usuarioLogado.tipo !== 1) {
      navigate('/')
      return
    }
  }, [usuarioLogado, navigate])

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tipo' ? parseInt(value) : value
    }))

    // Limpa mensagens de erro/sucesso ao editar
    setError(null)
    setSuccess(null)
  }

  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validações básicas
      if (!formData.email || !formData.senha || !formData.tipo) {
        setError('Todos os campos são obrigatórios')
        return
      }

      if (formData.senha.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres')
        return
      }

      const result = await servicoApi.post<RespostaCriarUsuario>('/usuarios/register', formData)

      if (result.success) {
        setSuccess(result.message || 'Usuário criado com sucesso')
        // Redireciona após 2 segundos
        setTimeout(() => {
          navigate('/usuarios')
        }, 2000)
      } else {
        setError(result.message || 'Erro ao criar usuário')
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      setError('Erro ao criar usuário. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Não renderiza nada se o usuário não for administrador
  if (usuarioLogado && usuarioLogado.tipo !== 1) {
    return null
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Alterar Senha do Usuário</h2>
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/usuarios')}
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
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-3">
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Digite o email do usuário"
                        required
                        disabled={loading}
                      />
                      <Form.Text className="text-muted">
                        Este email será usado como login do usuário
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Senha *</Form.Label>
                      <Form.Control
                        type="password"
                        name="senha"
                        value={formData.senha}
                        onChange={handleInputChange}
                        placeholder="Digite a senha"
                        required
                        disabled={loading}
                        minLength={6}
                      />
                      <Form.Text className="text-muted">
                        Mínimo de 6 caracteres
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Usuário *</Form.Label>
                      <Form.Select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      >
                        <option value={1}>1 - Administrador</option>
                        <option value={2}>2 - Operador</option>
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Administradores têm acesso total ao sistema
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="d-flex align-items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faSave} />
                    {loading ? 'Salvando...' : 'Salvar Usuário'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate('/usuarios')}
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

export default UserForm
