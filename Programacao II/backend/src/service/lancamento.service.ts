
import { Lancamento } from '../interface/lancamento';
import db from '../db/database';

export class LancamentoService {
    public async getLancamentos(): Promise<Lancamento[]> {
        return db.any(`
            SELECT
            l.lanc_codigo
            l.lanc_valor
            l.lanc_data
            l.lanc_arquivo
            l.lanc_tipl_codigo
            l.lanc_veic_placa
            FROM lanc_lancamento l
            JOIN tipl_tipo_lancamento t ON l.lanc_tipl_codigo = t.tipl_codigo
            ORDER BY l.lanc_data DESC
            `);
    }

    public async getLancamentoById(id: number): Promise<Lancamento | null> {
        return db.oneOrNone(`
            SELECT
            l.lanc_codigo
            l.lanc_valor
            l.lanc_data
            l.lanc_arquivo
            l.lanc_tipl_codigo
            l.lanc_veic_placa
            FROM lanc_lancamento l
            JOIN tipl_tipo_lancamento t ON l.lanc_tipl_codigo = t.tipl_codigo
            ORDER BY l.lanc_data DESC
            w
            `, [id]);
    }

   public async createLancamento(data: Lancamento): Promise<{ success: boolean; id?: number; message?: string }> {
    // Busca o tipo de lançamento pelo idTipoLancamento
    const tipoLancamento = await db.oneOrNone(`
            SELECT lanc_tipl_codigo
            FROM lanc_lancamento l
            JOIN tipl_tipo_lancamento t ON l.lanc_tipl_codigo = t.tipl_codigo
            WHERE id = $1`,
        [data.idTipoLancamento]
    );

    if (!tipoLancamento) {
        return { success: false, message: 'Tipo de lançamento não encontrado.' };
    }

    // Aqui você pode usar tipoLancamento.tipo para lógica extra, se necessário
    // Exemplo: if (tipoLancamento.tipo === 1) { ... }

    const result = await db.one(
        `INSERT INTO lanc_lancamento (lanc_valor, lanc_data, lanc_arquivo, lanc_tipl_codigo, lanc_veic_placa)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [data.valor, data.data, data.arquivo, data.idTipoLancamento, data.placaVeiculo]
    );
    return { success: true, id: result.id };
   }

    public async updateLancamento(id: number, data: Partial<Lancamento>): Promise<{ success: boolean }> {
          try {
            const lancamentoExistente = await this.getLancamentoById(id);
            if (!lancamentoExistente) {
                throw new Error('Lancamento não encontrado');
            }

            return await db.tx(async t => {
                // Atualizar campos da tabela principal lanc_lancamento
                const camposLancamento = [];
                const valoresLancamento = [];
                if (data.valor !== undefined) {
                    camposLancamento.push('lanc_valor = $' + (camposLancamento.length + 1));
                    valoresLancamento.push(data.valor);
                }
                if (data.data !== undefined) {
                    camposLancamento.push('lanc_data = $' + (camposLancamento.length + 1));
                    valoresLancamento.push(data.data);
                }
                if (data.arquivo !== undefined) {
                    camposLancamento.push('lanc_arquivo = $' + (camposLancamento.length + 1));
                    valoresLancamento.push(data.arquivo);
                }
                if (data.idTipoLancamento !== undefined) {
                    camposLancamento.push('lanc_tipl_codigo = $' + (camposLancamento.length + 1));
                    valoresLancamento.push(data.idTipoLancamento);
                }
                if (data.placaVeiculo !== undefined) {
                    camposLancamento.push('lanc_veic_placa = $' + (camposLancamento.length + 1));
                    valoresLancamento.push(data.placaVeiculo);
                }

                // Atualizar tabela principal se houver campos para atualizar
                if (camposLancamento.length > 0) {
                    valoresLancamento.push(id);
                    await t.none(`
                        UPDATE lanc_lancamento
                        SET ${camposLancamento.join(', ')}
                        WHERE id = $${valoresLancamento.length}
                    `, valoresLancamento);
                }
                return { success: true, id };
            });
        }
            catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Erro ao atualizar veículo: ${error}`);
        }
    }


    public async deleteLancamento(id: number): Promise<{ success: boolean }> {
        try{
            const lancamento = await this.getLancamentoById(id);
            if (!lancamento) {
                throw new Error('Lançamento não encontrado');
            }
            await db.none(`
            DELETE FROM lanc_lancamento
            WHERE id = $1`, [id]);
        return { success: true };
        } catch (error) {
            throw new Error(`Erro ao deletar lançamento: ${error}`);
        }

    }
}


