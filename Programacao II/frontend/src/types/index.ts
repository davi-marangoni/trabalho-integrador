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

// Exportações dos tipos do dashboard
export * from './dashboard'
export * from './totalEntradas'
export * from './totalSaidas'
export * from './saldoTotal'
export * from './distribuicaoFinanceira'
export * from './movimentacaoDiaria'

// Interfaces específicas para usuários
export interface RespostaUsuarios {
  success: boolean
  data: Usuario[]
  message: string
}

export interface RespostaCriarUsuario {
  success: boolean
  data: Usuario
  message: string
}

export interface RespostaOperacao {
  success: boolean
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

// Interfaces para Frotas
export interface Frota {
  id: number
  placacavalo: string
  placacarreta: string
  emailusuarioadicionou: string
}

export interface NovaFrota {
  placaCarreta: string
  placaCavalo: string
}

export interface VeiculoParaSelecao {
  placa: string
  modelo: string
  renavam: string
  situacao: string
  tipo: number
  descricaoTipo: string
  ano: number
  emailUsuarioAdicionou: string
  marcaEquipamentoFrio?: string
  anoEquipamentoFrio?: number
  quantidadePaletes?: number
  idFrota?: number
}
