import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap'
import { ReactTabulator, ColumnDefinition } from 'react-tabulator'
import 'react-tabulator/css/tabulator_bootstrap5.min.css'

import { servicoApi } from '../services/api'
import { useSidebar } from '../components/Layout'
import { Frota, RespostaApi } from '../types'

const Frotas: React.FC = () => {
  const navigate = useNavigate()
  const [frotas, setFrotas] = useState<Frota[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [frotaToDelete, setFrotaToDelete] = useState<{ id: number; nome: string } | null>(null)
  const tableRef = useRef<any>(null)
  const resizeTimeoutRef = useRef<number | null>(null)
  const { isCollapsed } = useSidebar()

  // Função debounced para redimensionar tabela
  const debouncedResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }

    resizeTimeoutRef.current = setTimeout(() => {
      if (tableRef.current?.table) {
        try {
          tableRef.current.table.redraw(true)
        } catch (error) {
          console.log('Erro ao redimensionar tabela:', error)
        }
      }
    }, 300)
  }, [])

  // Função para confirmar exclusão
  const handleDeleteConfirm = (frota: Frota) => {
    setFrotaToDelete({
      id: frota.id,
      nome: `${frota.placacavalo} - ${frota.placacarreta}`
    })
    setShowDeleteModal(true)
  }

  // Função para excluir frota
  const handleDeleteFrota = async () => {
    if (!frotaToDelete) return

    try {
      const result = await servicoApi.delete<{ success: boolean; message: string }>(`/frotas/${frotaToDelete.id}`)

      if (result.success) {
        // Recarrega a lista após exclusão
        await fetchFrotas()
        setShowDeleteModal(false)
        setFrotaToDelete(null)
      } else {
        setErro(result.message || 'Erro ao excluir frota')
      }
    } catch (error: any) {
      setErro(error.message || 'Erro ao excluir frota')
    }
  }

  // Configuração das colunas do Tabulator
  const columns: ColumnDefinition[] = [
    {
      title: 'ID',
      field: 'id',
      minWidth: 80,
      headerSort: true
    },
    {
      title: 'Placa do Cavalo',
      field: 'placacavalo',
      minWidth: 150,
      headerFilter: 'input',
      headerSort: true
    },
    {
      title: 'Placa da Carreta',
      field: 'placacarreta',
      minWidth: 150,
      headerFilter: 'input',
      headerSort: true
    },
    {
      title: 'Ações',
      field: 'acoes',
      width: 120,
      headerSort: false,
      formatter: () => {
        return '<button class="btn btn-sm btn-outline-danger delete-btn" title="Excluir frota"><i class="fas fa-trash me-1"></i>Excluir</button>'
      },
      cellClick: (e: any, cell: any) => {
        if (e.target.closest('.delete-btn')) {
          const frota = cell.getRow().getData()
          handleDeleteConfirm(frota)
        }
      }
    }
  ]

  // Função para buscar frotas da API
  const fetchFrotas = async () => {
    try {
      setLoading(true)
      setErro(null)

      const result = await servicoApi.get<RespostaApi<Frota[]>>('/frotas')

      if (result.success && result.data) {
        setFrotas(result.data)
      } else {
        setErro(result.message)
      }
    } catch (error: any) {
      setErro(error.message || 'Erro ao buscar frotas')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFrota = () => {
    navigate('/frotas/cadastrar')
  }

  useEffect(() => {
    fetchFrotas()
  }, [])

  // Efeito para redimensionar tabela quando sidebar muda
  useEffect(() => {
    debouncedResize()
  }, [isCollapsed, debouncedResize])

  // Listener para mudanças de tamanho da janela e cleanup
  useEffect(() => {
    const handleResize = () => debouncedResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [debouncedResize])

  return (
    <div className="frotas-container">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h1>Frotas</h1>
              <Button variant="primary" onClick={handleAddFrota}>
                Adicionar Frota
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

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title>Lista de Frotas</Card.Title>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center p-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                  </div>
                ) : (
                  <ReactTabulator
                    ref={tableRef}
                    data={frotas}
                    columns={columns}
                    layout="fitDataStretch"
                    pagination="local"
                    paginationSize={15}
                    paginationSizeSelector={[10, 15, 25, 50, 100]}
                    movableColumns={true}
                    resizableColumns={true}
                    headerSort={true}
                    headerSortTristate={true}
                    responsiveLayout="hide"
                    placeholder="Nenhuma frota encontrada"
                    options={{
                      height: '600px',
                      autoResize: true,
                      dataLoaded: () => {
                        // Redimensiona após dados carregados
                        setTimeout(() => debouncedResize(), 100)
                      }
                    }}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal de confirmação de exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja deletar a frota <strong>{frotaToDelete?.nome}</strong>?
          <br />
          <span className="text-danger">Esta ação não pode ser desfeita.</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteFrota}>
            Deletar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Frotas
