import { TipoLancamento } from '../interface/tipoLancamento';
import db from '../db/database';

export class TipoLancamentoService {
    public async getTipoLancamentos(): Promise<TipoLancamento[]> {
        return db.any(`
            SELECT
            tipl_codigo
            tipl_descricao
            tipl_tipo
            FROM tipl_tipo_lancamento
            ORDER BY tipl_descricao ASC
            `);
    }

    public async getTipoLancamentoById(id: number): Promise<TipoLancamento | null> {
        return db.oneOrNone(`
            SELECT
            tipl_codigo
            tipl_descricao
            tipl_tipo
            FROM tipl_tipo_lancamento
            ORDER BY tipl_descricao ASC
            WHERE tipl_codigo = $1
            `, [id]);
    }

   public async createTipoLancamento(data: TipoLancamento): Promise<{ success: boolean; id?: number; message?: string }> {
    // Busca o tipo de lançamento pelo idTipoLancamento
    const tipoLancamento = await db.oneOrNone(`
            SELECT lanc_tipl_codigo
            FROM lanc_lancamento l
            JOIN tipl_tipo_lancamento t ON l.lanc_tipl_codigo = t.tipl_codigo
            WHERE id = $1`,
        [data.id]
    );

    if (!tipoLancamento) {
        return { success: false, message: 'Tipo de lançamento não encontrado.' };
    }


    const result = await db.one(
        `INSERT INTO tipl_tipo_lancamento (tipl_codigo, tipl_descricao, tipl_tipo)
         VALUES ($1, $2, $3) RETURNING id`,
        [data.id, data.descricao, data.tipo]
    );
    return { success: true, id: result.id };
}

    public async updateTipoLancamento(id: number, data: Partial<TipoLancamento>): Promise<{ success: boolean }> {
       try {
        const tipolancamentoExistente = await this.getTipoLancamentoById(id);
            if (!tipolancamentoExistente) {
                throw new Error('Tipo de Lancamento não encontrado');
            }
            const camposTipoLancamento= [];
            const valoresTipoLancamento = [];
            if (data.descricao) {
                camposTipoLancamento.push('tipl_descricao = $1');
                valoresTipoLancamento.push(data.descricao);
            }
            if (data.tipo) {
                camposTipoLancamento.push('tipl_tipo = $2');
                valoresTipoLancamento.push(data.tipo);
            }
            if (camposTipoLancamento.length === 0) {
                throw new Error('Nenhum campo para atualizar');
            }

        await db.none(
            `UPDATE tipl_tipo_lancamento
             SET tipl_descricao = $1, tipl_tipo = $2
             WHERE tipl_codigo = $3`,
            [data.descricao, data.tipo, id]
        );
        return { success: true };
       } catch (error) {
        console.error('Erro ao atualizar tipo de lançamento:', error);
        return { success: false };
    }}

    public async deleteTipoLancamento(id: number): Promise<{ success: boolean }> {
        try {
            const tipolancamentoExistente = await this.getTipoLancamentoById(id);
            if (!tipolancamentoExistente) {
                throw new Error('Tipo de Lancamento não encontrado');
            }
             await db.none(`
            DELETE FROM tipl_tipo_lancamento
            WHERE id = $1`, [id]);
        return { success: true };
        } catch (error) {
            console.error('Erro ao verificar tipo de lançamento:', error);
            return { success: false };
        }

    }
}
