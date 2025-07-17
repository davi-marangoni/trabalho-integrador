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

// Interface genérica para veículos (usada na listagem)
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
