export interface RelatorioFiltros {
    dataInicio?: string;
    dataFim?: string;
    tipo?: string;
    placaVeiculo?: string;
    idTipoLancamento?: string;
}

export interface RelatorioLancamento {
    id: number;
    valor: number;
    data: string;
    tipo: string;
    descricao: string;
    placaVeiculo: string;
    emailUsuario: string;
}

export interface RelatorioTotais {
    total_lancamentos: number;
    total_entradas: number;
    total_saidas: number;
}
