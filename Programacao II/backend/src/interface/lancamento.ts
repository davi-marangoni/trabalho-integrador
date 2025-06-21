
export interface Lancamento {
    id: number;
    valor: number;
    data: Date;
    arquivo: string;
    idTipoLancamento: number;
    placaVeiculo: string;
    emailUsuarioAdicionou: string;
}

export interface Abastecimento extends Lancamento {
    postoGasolina: string;
    tipoCombustivel: string;
    valorUnidade: number;
    quantidadeLitros: number;
    valorTotal: number;
    quilometrosRodados: number;
}

export interface ConhecimentoTransporte extends Lancamento {
    numeroConhecimento: string;
    serieConhecimento: string;
}
