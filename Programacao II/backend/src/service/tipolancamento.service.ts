import { TipoLancamento } from '../interface/tipoLancamento';
import db from '../db/database';

export class TipoLancamentoService {
    public async getTipoLancamentos(): Promise<TipoLancamento[]> {
        return db.any('SELECT * FROM tipl_tipo_lancamento');
    }

    public async getTipoLancamentoById(id: number): Promise<TipoLancamento | null> {
        return db.oneOrNone('SELECT * FROM tipl_tipo_lancamento WHERE id = $1', [id]);
    }

   public async createTipoLancamento(data: TipoLancamento): Promise<{ success: boolean; id?: number; message?: string }> {
    // Busca o tipo de lançamento pelo idTipoLancamento
    const tipoLancamento = await db.oneOrNone(
        'SELECT * FROM lanc_tipl_codigo WHERE id = $1',
        [data.id]
    );

    if (!tipoLancamento) {
        return { success: false, message: 'Tipo de lançamento não encontrado.' };
    }

    // Aqui você pode usar tipoLancamento.tipo para lógica extra, se necessário
    // Exemplo: if (tipoLancamento.tipo === 1) { ... }

    const result = await db.one(
        `INSERT INTO tipl_tipo_lancamento (tipl_codigo, tipl_descricao, tipl_tipo)
         VALUES ($1, $2, $3) RETURNING id`,
        [data.id, data.descricao, data.tipo]
    );
    return { success: true, id: result.id };
}

    public async updateTipoLancamento(id: number, data: Partial<TipoLancamento>): Promise<{ success: boolean }> {
        // Implemente a lógica de atualização conforme necessário
        return { success: true };
    }

    public async deleteTipoLancamento(id: number): Promise<{ success: boolean }> {
        await db.none('DELETE FROM tipl_tipo_lancamento WHERE id = $1', [id]);
        return { success: true };
    }
}
