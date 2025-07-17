import { DadosFinanceiros } from './distribuicaoFinanceira'

export interface MetricasDashboard {
  totalEntradas: number
  totalSaidas: number
  saldoTotal: number
  veiculosAtivos: number
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
