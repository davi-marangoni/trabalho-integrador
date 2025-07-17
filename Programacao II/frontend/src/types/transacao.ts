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
