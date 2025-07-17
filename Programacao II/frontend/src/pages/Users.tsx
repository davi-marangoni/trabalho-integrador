import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap'
import { ReactTabulator, ColumnDefinition } from 'react-tabulator'
import 'react-tabulator/css/tabulator_bootstrap5.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

import { servicoApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Usuario, RespostaApi } from '../types'

const Usuarios: React.FC = () => {
  const navigate = useNavigate()
  const { usuario: usuarioLogado } = useAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  // Verifica se o usuário logado é administrador
  useEffect(() => {
    if (usuarioLogado && usuarioLogado.tipo !== 1) {
      navigate('/')
      return
    }
  }, [usuarioLogado, navigate])

  // Função para buscar usuários
  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await servicoApi.get<RespostaApi<Usuario[]>>('/usuarios')

      if (result.success && result.data) {
        setUsuarios(result.data)
      } else {
        setError(result.message || 'Erro ao buscar usuários')
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      setError('Erro ao carregar dados dos usuários')
    } finally {
      setLoading(false)
    }
  }, [])

  // Carrega dados ao montar o componente
  useEffect(() => {
    fetchUsuarios()
  }, [fetchUsuarios])

  // Função para formatar o tipo do usuário
  const formatarTipo = (tipo: number): string => {
    return tipo === 1 ? '1 - Administrador' : '2 - Operador'
  }

  // Função para confirmar exclusão
  const handleDeleteConfirm = (email: string) => {
    setUserToDelete(email)
    setShowDeleteModal(true)
  }

  // Função para deletar usuário
  const handleDelete = async () => {
    if (!userToDelete) return

    try {
      const result = await servicoApi.delete<RespostaApi>(`/usuarios/${encodeURIComponent(userToDelete)}`)

      if (result.success) {
        await fetchUsuarios() // Recarrega a lista
        setShowDeleteModal(false)
        setUserToDelete(null)
      } else {
        setError(result.message || 'Erro ao deletar usuário')
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      setError('Erro ao deletar usuário')
    }
  }

  // Função para editar senha
  const handleEditPassword = (email: string) => {
    navigate(`/usuarios/editar-senha/${encodeURIComponent(email)}`)
  }

  // Configuração das colunas do Tabulator
  const columns: ColumnDefinition[] = [
    {
      title: 'Email',
      field: 'email',
      minWidth: 250,
      headerFilter: 'input',
      headerSort: true
    },
    {
      title: 'Tipo',
      field: 'tipo',
      minWidth: 200,
      headerSort: true,
      formatter: (cell: any) => {
        const tipo = cell.getValue()
        return formatarTipo(tipo)
      }
    },
    {
      title: 'Ações',
      field: 'acoes',
      minWidth: 200,
      headerSort: false,
      formatter: (cell: any) => {
        const email = cell.getRow().getData().email
        return `
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary edit-password-btn" data-email="${email}" title="Alterar Senha">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger delete-btn" data-email="${email}" title="Deletar">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `
      },
      cellClick: (e: any, cell: any) => {
        const target = e.target.closest('button')
        if (!target) return

        const email = target.dataset.email
        if (target.classList.contains('edit-password-btn')) {
          handleEditPassword(email)
        } else if (target.classList.contains('delete-btn')) {
          handleDeleteConfirm(email)
        }
      }
    }
  ]

  // Não renderiza nada se o usuário não for administrador
  if (usuarioLogado && usuarioLogado.tipo !== 1) {
    return null
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Gerenciamento de Usuários</h2>
            <Button 
              variant="primary" 
              onClick={() => navigate('/usuarios/cadastrar')}
              className="d-flex align-items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              Cadastrar Usuário
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              ) : (
                <ReactTabulator
                  data={usuarios}
                  columns={columns}
                  layout="fitColumns"
                  responsiveLayout="hide"
                  pagination="local"
                  paginationSize={20}
                  paginationSizeSelector={[10, 20, 50, 100]}
                  movableColumns={true}
                  placeholder="Nenhum usuário encontrado"
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de confirmação de exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja deletar o usuário <strong>{userToDelete}</strong>?
          <br />
          <span className="text-danger">Esta ação não pode ser desfeita.</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Deletar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Usuarios
