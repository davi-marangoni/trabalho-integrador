// Tipo genérico para todas as respostas da API
export interface RespostaApi<T = any> {
  success: boolean
  data?: T
  message: string
}
