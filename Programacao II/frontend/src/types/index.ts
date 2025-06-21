// Tipos básicos do sistema
export interface Usuario {
  id: number
  nome: string
  email: string
  senha?: string
  tipo: 'admin' | 'usuario'
  ativo: boolean
  criadoEm?: string
  atualizadoEm?: string
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

export interface RespostaLogin {
  token: string
  usuario: Usuario
}

export interface RespostaApi<T> {
  sucesso: boolean
  dados?: T
  mensagem?: string
  erro?: string
}
