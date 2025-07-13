import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'

import { servicoApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { RespostaOperacao } from '../types'

const PasswordEditForm: React.FC = () => {
  const navigate = useNavigate()
  const { email } = useParams<{ email: string }>()
  const { usuario: usuarioLogado } = useAuth()
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
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

  // Verifica se o email está presente
  useEffect(() => {
    if (!email) {
      navigate('/usuarios')
      return
    }
  }, [email, navigate])

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'novaSenha') {
      setNovaSenha(value)
    } else if (name === 'confirmarSenha') {
      setConfirmarSenha(value)
    }

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
      // Validações
      if (!novaSenha || !confirmarSenha) {
        setError('Todos os campos são obrigatórios')
        return
      }

      if (novaSenha.length < 6) {
        setError('A nova senha deve ter pelo menos 6 caracteres')
        return
      }

      if (novaSenha !== confirmarSenha) {
        setError('As senhas não coincidem')
        return
      }

      const result = await servicoApi.put<RespostaOperacao>(`/usuarios/${encodeURIComponent(email!)}/senha`, {
        novaSenha
      })

      if (result.success) {
        setSuccess(result.message || 'Senha alterada com sucesso')
        // Redireciona após 2 segundos
        setTimeout(() => {
          navigate('/usuarios')
        }, 2000)
      } else {
        setError(result.message || 'Erro ao alterar senha')
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      setError('Erro ao alterar senha. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Não renderiza nada se o usuário não for administrador
  if (usuarioLogado && usuarioLogado.tipo !== 1) {
    return null
  }

  if (!email) {
    return null
  }

  const decodedEmail = decodeURIComponent(email)

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
        <Col xs={12} md={11} lg={6} xl={12}>
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
                <Form.Group className="mb-3">
                  <Form.Label>Email do Usuário</Form.Label>
                  <Form.Control
                    type="email"
                    value={decodedEmail}
                    disabled
                    readOnly
                  />
                  <Form.Text className="text-muted">
                    Este campo não pode ser alterado
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nova Senha *</Form.Label>
                  <Form.Control
                    type="password"
                    name="novaSenha"
                    value={novaSenha}
                    onChange={handleInputChange}
                    placeholder="Digite a nova senha"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <Form.Text className="text-muted">
                    Mínimo de 6 caracteres
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Nova Senha *</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmarSenha"
                    value={confirmarSenha}
                    onChange={handleInputChange}
                    placeholder="Confirme a nova senha"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <Form.Text className="text-muted">
                    Digite novamente a nova senha para confirmar
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2 mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="d-flex align-items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faSave} />
                    {loading ? 'Alterando...' : 'Alterar Senha'}
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

export default PasswordEditForm
