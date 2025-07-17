// Core dashboard data types
export interface TotalEntradas {
  total_entradas: number
}

export interface TotalSaidas {
  total_saidas: number
}

export interface MovimentacaoDay {
  dia: string
  total_entradas: number
  total_saidas: number
}

export interface MovimentacaoDiaria {
  dias: MovimentacaoDay[]
}

export interface VeiculosAtivos {
  count: number
}
