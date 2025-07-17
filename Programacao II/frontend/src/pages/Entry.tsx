import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { ReactTabulator, ColumnDefinition } from 'react-tabulator'
import 'react-tabulator/css/tabulator_bootstrap5.min.css'
import axios from 'axios';

import { useSidebar } from '../components/Layout'
import { servicoApi } from '../services/api'
import { RespostaApi } from '../types'

interface Lancamento {
  id: number;
  valor: number;
  data: string;
  arquivo: string;
  idTipoLancamento: number;
  placaVeiculo: string;
  emailUsuarioAdicionou: string;
}

interface TipoLancamento {
    id: number;
    descricao: string;
    tipo: number; // 1 - Entrada, 2 - Saida
}

const Lancamentos: React.FC = () => {
  const navigate = useNavigate()
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [loading, setLoading] = useState(true)
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

const columns: ColumnDefinition[] = [
    {
      title: 'Descrição',
      field: 'desricao',
      minWidth: 120,
      headerFilter: 'input',
      headerSort: true
    },
    {
      title: 'Tipo',
      field: 'tipo',
      minWidth: 150,
      headerSort: true
    },
    {
      title: 'Ações',
      field: 'acoes',
      width: 120,
      headerSort: false,
      formatter: () => {
        return '<button class="btn btn-sm btn-outline-primary edit-btn" title="Editar descrição"><i class="fas fa-edit me-1"></i>Editar</button>'
      },
      cellClick: (e: any, cell: any) => {
        if (e.target.closest('.edit-btn')) {
          const lancamento = cell.getRow().getData()
          handleEditLancamento(lancamento)
        }
      }
    }
]

  const initializeData = async () => {
    await fetchLancamentos()
  }

   useEffect(() => {
      initializeData()
    }, [])
  const handleEditLancamento = (lancamento: TipoLancamento) => {
    navigate(`/tipolancamento/${lancamento.descricao}`)
  }

    const handleAddLancamento = () => {
    navigate('/tipolancamento')
  }

  const fetchLancamentos = async () => {
      try {
        setLoading(true)
        const result = await servicoApi.get<RespostaApi<Lancamento[]>>('/lancamentos')

        if (result.success && result.data) {
          setLancamentos(result.data)
        } else {
          console.error('Erro ao buscar lancamentos:', result.message)
        }
      } catch (error) {
        console.error('Erro na requisição:', error)
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="entries-container">
          <Container fluid>
            <Row className="mb-4">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <h1>Lançamento</h1>
                  <Button variant="primary" onClick={handleAddLancamento}>
                    Adicionar Lançamento
                  </Button>
                </div>
              </Col>
            </Row>

          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <Card.Title>Lista de Lançamentos</Card.Title>
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
                        data={lancamentos}
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
                        placeholder="Nenhum lançamento encontrado"
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
        </div>
  );
}
export default Lancamentos
