
export interface Veiculo {
    placa: string;
    modelo: string;
    renavam: string;
    situacao: string; // A - Ativo, I - Inativo
    ano: number;
    emailUsuarioAdicionou: string;
}

export interface CarretaFrigorificada extends Veiculo {
    marcaEquipamentoFrio: string;
    anoEquipamentoFrio: number;
    quantidadePaletes: number;
    idFrota: number;
}

export interface VeiculoCavalo extends Veiculo {
    trucado: string; // S - Sim, N - Não
    idFrota: number;
}
