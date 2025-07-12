import { TipoLancamento } from '../interface/tipoLancamento';
import { Lancamento } from '../interface/lancamento';
import db from '../db/database';

export class LancamentoService {
    public async getLancamentos(): Promise<Lancamento[]> {
        return db.any('SELECT * FROM transacoes');
    }

    public async getLancamentoById(id: number): Promise<Lancamento | null> {
        return db.oneOrNone('SELECT * FROM transacoes WHERE id = $1', [id]);
    }

   public async createLancamento(data: Lancamento): Promise<{ success: boolean; id?: number; message?: string }> {
    // Busca o tipo de lançamento pelo idTipoLancamento
    const tipoLancamento = await db.oneOrNone(
        'SELECT * FROM tipo_lancamento WHERE id = $1',
        [data.idTipoLancamento]
    );

    if (!tipoLancamento) {
        return { success: false, message: 'Tipo de lançamento não encontrado.' };
    }

    // Aqui você pode usar tipoLancamento.tipo para lógica extra, se necessário
    // Exemplo: if (tipoLancamento.tipo === 1) { ... }

    const result = await db.one(
        `INSERT INTO lancamento (valor, data, arquivo, idTipoLancamento, placaVeiculo, emailUsuarioAdicionou)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [data.valor, data.data, data.arquivo, data.idTipoLancamento, data.placaVeiculo, data.emailUsuarioAdicionou]
    );
    return { success: true, id: result.id };
}

    public async updateLancamento(id: number, data: Partial<Lancamento>): Promise<{ success: boolean }> {
        // Implemente a lógica de atualização conforme necessário
        return { success: true };
    }

    public async deleteLancamento(id: number): Promise<{ success: boolean }> {
        await db.none('DELETE FROM transacoes WHERE id = $1', [id]);
        return { success: true };
    }
}
