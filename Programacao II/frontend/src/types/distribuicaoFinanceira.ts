export interface DadosFinanceiros {
  nome: string
  valor: number
  cor: string
}

export interface DistribuicaoFinanceiraProps {
  totalEntradas: number | null
  totalSaidas: number | null
}
