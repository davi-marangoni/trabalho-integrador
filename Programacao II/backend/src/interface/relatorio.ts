export interface RelatorioLancamento {
    id: number;
    valor: number;
    data: string;
    tipo: string;
    descricao: string;
    placaVeiculo: string;
    emailUsuario: string;
}

export interface RelatorioFiltros {
    dataInicio?: string;
    dataFim?: string;
    tipo?: number; // 1 entrada, 2 saída
    placaVeiculo?: string;
    idTipoLancamento?: number;
}
