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
