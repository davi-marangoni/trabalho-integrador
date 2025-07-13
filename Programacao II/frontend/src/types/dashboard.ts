export interface TotalEntradasResponse {
  success: boolean
  data?: {
    total_entradas: number
  }
  message: string
}

export interface TotalSaidasResponse {
  success: boolean
  data?: {
    total_saidas: number
  }
  message: string
}

export interface MovimentacaoDay {
  dia: string
  total_entradas: number
  total_saidas: number
}

export interface MovimentacaoDiariaResponse {
  success: boolean
  data?: {
    dias: MovimentacaoDay[]
  }
  message: string
}

export interface VeiculosAtivosResponse {
  success: boolean
  data?: {
    count: number
  }
  message: string
}
