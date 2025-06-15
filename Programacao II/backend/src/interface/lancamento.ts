
export interface Lancamento {
    id: number;
    valor: number;
    data: Date;
    arquivo: string;
    tipoLancamentoId: number;
    placaVeiculo: string;
}

export interface Abastecimento extends Lancamento {
    postoGasolina: string;
    tipoCombustivel: string;
    valorUnidade: number;
    quantidadeLitros: number;
    valorTotal: number;
    kmRodados: number;
}

export interface ConhecimentoTransporte extends Lancamento {
    numeroConhecimento: string;
    serieConhecimento: string;
}
