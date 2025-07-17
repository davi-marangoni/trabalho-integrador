import { TipoLancamento } from '../interface/tipoLancamento';
import db from '../db/database';

export class TipoLancamentoService {
    public async getTipoLancamentos(): Promise<TipoLancamento[]> {
        return db.any(`
            SELECT
                tipl_codigo as id,
                tipl_descricao as descricao,
                tipl_tipo as tipo
            FROM tipl_tipo_lancamento
            ORDER BY tipl_descricao ASC
        `);
    }

    public async getTipoLancamentoById(id: number): Promise<TipoLancamento | null> {
        return db.oneOrNone(`
            SELECT
                tipl_codigo as id,
                tipl_descricao as descricao,
                tipl_tipo as tipo
            FROM tipl_tipo_lancamento
            WHERE tipl_codigo = $1
        `, [id]);
    }

   public async createTipoLancamento(data: any): Promise<{ success: boolean; id?: number; message?: string }> {
        try {
            const result = await db.one(
                `INSERT INTO tipl_tipo_lancamento (tipl_descricao, tipl_tipo, tipl_usua_email)
                 VALUES ($1, $2, $3) RETURNING tipl_codigo`,
                [data.descricao, data.tipo, data.emailUsuario || 'system@example.com']
            );
            return { success: true, id: result.tipl_codigo };
        } catch (error) {
            console.error('Erro ao criar tipo de lançamento:', error);
            return { success: false, message: 'Erro ao criar tipo de lançamento' };
        }
    }

    public async updateTipoLancamento(id: number, data: any): Promise<{ success: boolean }> {
        try {
            const tipolancamentoExistente = await this.getTipoLancamentoById(id);
            if (!tipolancamentoExistente) {
                throw new Error('Tipo de Lancamento não encontrado');
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
        }
    }

    public async deleteTipoLancamento(id: number): Promise<{ success: boolean }> {
        try {
            const tipolancamentoExistente = await this.getTipoLancamentoById(id);
            if (!tipolancamentoExistente) {
                throw new Error('Tipo de Lancamento não encontrado');
            }

            await db.none('DELETE FROM tipl_tipo_lancamento WHERE tipl_codigo = $1', [id]);
            return { success: true };
        } catch (error) {
            console.error('Erro ao deletar tipo de lançamento:', error);
            return { success: false };
        }
    }
}
