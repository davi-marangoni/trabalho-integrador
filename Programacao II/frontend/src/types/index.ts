export interface Usuario {
  email: string
  tipo: number // 1 = forte, 2 = fraco
}

export interface UsuarioCompleto extends Usuario {
  senha?: string
}

export interface Veiculo {
  id: number
  placa: string
  modelo: string
  marca: string
  ano: number
  ativo: boolean
  criadoEm?: string
  atualizadoEm?: string
}

export interface Transacao {
  id: number
  data: string
  tipo: string
  valor: number
  veiculoId: number
  descricao?: string
  criadoEm?: string
  atualizadoEm?: string
}

export interface SolicitacaoLogin {
  email: string
  senha: string
}

export interface DadosLogin {
  usuario: Usuario
  token: string
}

export interface RespostaLogin {
  success: boolean
  data: DadosLogin
  message: string
}

// Tipo genérico para todas as respostas da API
export interface RespostaApi<T = any> {
  success: boolean
  data?: T
  message: string
}

// Interfaces para o Dashboard
export interface MetricasDashboard {
  totalEntradas: number
  totalSaidas: number
  saldoTotal: number
  veiculosAtivos: number
}

export interface DadosFinanceiros {
  nome: string
  valor: number
  cor: string
}

export interface DadosMovimentacaoDiaria {
  data: string
  entradas: number
  saidas: number
}

export interface DadosDashboard {
  metricas: MetricasDashboard
  distribuicaoFinanceira: DadosFinanceiros[]
  movimentacaoDiaria: DadosMovimentacaoDiaria[]
}

export interface TipoVeiculo {
  id: number
  nome: string
  temAtributosEspecificos: boolean
}

export interface VeiculoBase {
  placa: string
  modelo: string
  renavam: string
  situacao: string
  tipo: number
  ano: number
  emailUsuarioAdicionou: string
}

export interface VeiculoCavalo extends VeiculoBase {
  trucado: boolean
  idFrota?: number | null
}

export interface CarretaFrigorificada extends VeiculoBase {
  marcaEquipamentoFrio: string
  anoEquipamentoFrio: number
  quantidadePaletes: number
  idFrota?: number | null
}
