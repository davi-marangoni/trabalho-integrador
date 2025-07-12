import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { ReactTabulator, ColumnDefinition } from 'react-tabulator'
import 'react-tabulator/css/tabulator_bootstrap5.min.css'

import { servicoApi } from '../services/api'
import { useSidebar } from '../components/Layout'
import { TipoVeiculo } from '../types'

interface Veiculo {
  placa: string
  modelo: string
  renavam: string
  situacao: string
  tipo: number
  ano: number
  emailUsuarioAdicionou: string
  trucado?: string
  idFrota?: number | null
  marcaEquipamentoFrio?: string
  anoEquipamentoFrio?: number
  quantidadePaletes?: number
}

const Veiculos: React.FC = () => {
  const navigate = useNavigate()
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [tiposVeiculo, setTiposVeiculo] = useState<TipoVeiculo[]>([])
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

  // Função para buscar tipos de veículos da API
  const fetchTiposVeiculos = async () => {
    try {
      const result = await servicoApi.get<{ success: boolean; data: TipoVeiculo[]; message: string }>('/veiculos/tipos')

      if (result.success) {
        setTiposVeiculo(result.data)
      } else {
        console.error('Erro ao buscar tipos de veículos:', result.message)
      }
    } catch (error) {
      console.error('Erro na requisição de tipos:', error)
    }
  }

  // Função para obter nome do tipo de veículo
  const getTipoVeiculoNome = (id: number): string => {
    const tipo = tiposVeiculo.find(t => t.id === id)
    return tipo ? tipo.nome : 'Desconhecido'
  }

  // Função para gerar opções do filtro de tipos
  const getTipoVeiculoFilterOptions = () => {
    const options: { [key: string]: string } = { '': 'Todos' }
    tiposVeiculo.forEach(tipo => {
      options[tipo.id.toString()] = tipo.nome
    })
    return options
  }

  // Configuração das colunas do Tabulator
  const columns: ColumnDefinition[] = [
    {
      title: 'Placa',
      field: 'placa',
      minWidth: 120,
      headerFilter: 'input',
      headerSort: true
    },
    {
      title: 'Tipo',
      field: 'tipo',
      minWidth: 200,
      headerFilter: 'select',
      headerSort: true,
      headerFilterParams: {
        values: getTipoVeiculoFilterOptions()
      },
      formatter: (cell: any) => {
        const tipo = cell.getValue()
        return getTipoVeiculoNome(tipo)
      }
    },
    {
      title: 'Modelo',
      field: 'modelo',
      minWidth: 150,
      headerFilter: 'input',
      headerSort: true
    },
    {
      title: 'Ano',
      field: 'ano',
      minWidth: 100,
      headerFilter: 'input',
      headerSort: true
    },
    {
      title: 'Situação',
      field: 'situacao',
      minWidth: 120,
      headerFilter: 'select',
      headerSort: true,
      headerFilterParams: {
        values: {
          '': 'Todos',
          'A': 'Ativo',
          'I': 'Inativo'
        }
      },
      formatter: (cell: any) => {
        const situacao = cell.getValue()
        const variant = situacao === 'A' ? 'success' : 'danger'
        const texto = situacao === 'A' ? 'Ativo' : 'Inativo'
        return `<span class="badge bg-${variant}">${texto}</span>`
      }
    },
    {
      title: 'Ações',
      field: 'acoes',
      width: 120,
      headerSort: false,
      formatter: () => {
        return '<button class="btn btn-sm btn-outline-primary edit-btn" title="Editar veículo"><i class="fas fa-edit me-1"></i>Editar</button>'
      },
      cellClick: (e: any, cell: any) => {
        if (e.target.closest('.edit-btn')) {
          const veiculo = cell.getRow().getData()
          handleEditVeiculo(veiculo)
        }
      }
    }
  ]

  // Função para buscar veículos da API
  const fetchVeiculos = async () => {
    try {
      setLoading(true)
      const result = await servicoApi.get<{ success: boolean; data: Veiculo[]; message: string }>('/veiculos')

      if (result.success) {
        setVeiculos(result.data)
      } else {
        console.error('Erro ao buscar veículos:', result.message)
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
    } finally {
      setLoading(false)
    }
  }

  // Função para inicializar dados
  const initializeData = async () => {
    await fetchTiposVeiculos()
    await fetchVeiculos()
  }

  const handleEditVeiculo = (veiculo: Veiculo) => {
    navigate(`/veiculos/editar/${veiculo.placa}`)
  }

  const handleAddVeiculo = () => {
    navigate('/veiculos/cadastrar')
  }

  useEffect(() => {
    initializeData()
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
    <div className="vehicles-container">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h1>Veículos</h1>
              <Button variant="primary" onClick={handleAddVeiculo}>
                Adicionar Veículo
              </Button>
            </div>
          </Col>
        </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Lista de Veículos</Card.Title>
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
                    data={veiculos}
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
                    placeholder="Nenhum veículo encontrado"
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
  )
}

export default Veiculos
