
import { Lancamento, Abastecimento, ConhecimentoTransporte } from '../interface/lancamento';
import db from '../db/database';

export class LancamentoService {
    public async getLancamentos(): Promise<any[]> {
        return db.any(`
            SELECT
                l.lanc_codigo as id,
                l.lanc_valor as valor,
                l.lanc_data as data,
                l.lanc_arquivo as arquivo,
                l.lanc_tipl_codigo as idTipoLancamento,
                l.lanc_veic_placa as placaVeiculo,
                l.lanc_usua_email as emailUsuarioAdicionou,
                t.tipl_descricao as tipoDescricao,
                t.tipl_tipo as tipoCategoria,
                CASE 
                    WHEN a.abas_lanc_codigo IS NOT NULL THEN 'abastecimento'
                    WHEN c.ctre_lanc_codigo IS NOT NULL THEN 'ctre'
                    ELSE 'comum'
                END as tipoLancamento
            FROM lanc_lancamento l
            JOIN tipl_tipo_lancamento t ON l.lanc_tipl_codigo = t.tipl_codigo
            LEFT JOIN abas_abastecimento a ON l.lanc_codigo = a.abas_lanc_codigo
            LEFT JOIN ctre_conhecimento_transporte c ON l.lanc_codigo = c.ctre_lanc_codigo
            ORDER BY l.lanc_data DESC
        `);
    }

    public async getLancamentoById(id: number): Promise<any | null> {
        return db.oneOrNone(`
            SELECT
                l.lanc_codigo as id,
                l.lanc_valor as valor,
                l.lanc_data as data,
                l.lanc_arquivo as arquivo,
                l.lanc_tipl_codigo as idTipoLancamento,
                l.lanc_veic_placa as placaVeiculo,
                l.lanc_usua_email as emailUsuarioAdicionou,
                t.tipl_descricao as tipoDescricao,
                t.tipl_tipo as tipoCategoria,
                CASE 
                    WHEN a.abas_lanc_codigo IS NOT NULL THEN 'abastecimento'
                    WHEN c.ctre_lanc_codigo IS NOT NULL THEN 'ctre'
                    ELSE 'comum'
                END as tipoLancamento,
                -- Dados de abastecimento
                a.abas_posto_gasolina as postoGasolina,
                a.abas_tipo_combustivel as tipoCombustivel,
                a.abas_valor_unitario as valorUnidade,
                a.abas_quantidade as quantidadeLitros,
                a.abas_valor_total as valorTotal,
                a.abas_km_rodados as quilometrosRodados,
                -- Dados de CTRE
                c.ctre_numero as numeroConhecimento,
                c.ctre_serie as serieConhecimento
            FROM lanc_lancamento l
            JOIN tipl_tipo_lancamento t ON l.lanc_tipl_codigo = t.tipl_codigo
            LEFT JOIN abas_abastecimento a ON l.lanc_codigo = a.abas_lanc_codigo
            LEFT JOIN ctre_conhecimento_transporte c ON l.lanc_codigo = c.ctre_lanc_codigo
            WHERE l.lanc_codigo = $1
        `, [id]);
    }

   public async createLancamento(data: any): Promise<{ success: boolean; id?: number; message?: string }> {
    try {
        return await db.tx(async t => {
            // Inserir lançamento principal
            const result = await t.one(
                `INSERT INTO lanc_lancamento (lanc_valor, lanc_data, lanc_arquivo, lanc_tipl_codigo, lanc_veic_placa, lanc_usua_email)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING lanc_codigo`,
                [data.valor, data.data, data.arquivo || null, data.idTipoLancamento, data.placaVeiculo, data.emailUsuarioAdicionou]
            );

            const lancamentoId = result.lanc_codigo;

            // Se for abastecimento, inserir dados específicos
            if (data.isAbastecimento && data.dadosAbastecimento) {
                await t.none(
                    `INSERT INTO abas_abastecimento (abas_lanc_codigo, abas_posto_gasolina, abas_tipo_combustivel, 
                     abas_valor_unitario, abas_quantidade, abas_valor_total, abas_km_rodados)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        lancamentoId,
                        data.dadosAbastecimento.postoGasolina,
                        data.dadosAbastecimento.tipoCombustivel,
                        data.dadosAbastecimento.valorUnidade,
                        data.dadosAbastecimento.quantidadeLitros,
                        data.dadosAbastecimento.valorTotal,
                        data.dadosAbastecimento.quilometrosRodados
                    ]
                );
            }

            // Se for CTRE, inserir dados específicos
            if (data.isCtre && data.dadosCtre) {
                await t.none(
                    `INSERT INTO ctre_conhecimento_transporte (ctre_lanc_codigo, ctre_numero, ctre_serie)
                     VALUES ($1, $2, $3)`,
                    [
                        lancamentoId,
                        data.dadosCtre.numeroConhecimento,
                        data.dadosCtre.serieConhecimento
                    ]
                );
            }

            return { success: true, id: lancamentoId };
        });
    } catch (error) {
        console.error('Erro ao criar lançamento:', error);
        return { success: false, message: 'Erro ao criar lançamento' };
    }
   }

    public async updateLancamento(id: number, data: any): Promise<{ success: boolean }> {
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
                        WHERE lanc_codigo = $${valoresLancamento.length}
                    `, valoresLancamento);
                }

                // Atualizar dados específicos de abastecimento
                if (data.isAbastecimento && data.dadosAbastecimento) {
                    await t.none(`
                        UPDATE abas_abastecimento SET
                            abas_posto_gasolina = $1,
                            abas_tipo_combustivel = $2,
                            abas_valor_unitario = $3,
                            abas_quantidade = $4,
                            abas_valor_total = $5,
                            abas_km_rodados = $6
                        WHERE abas_lanc_codigo = $7
                    `, [
                        data.dadosAbastecimento.postoGasolina,
                        data.dadosAbastecimento.tipoCombustivel,
                        data.dadosAbastecimento.valorUnidade,
                        data.dadosAbastecimento.quantidadeLitros,
                        data.dadosAbastecimento.valorTotal,
                        data.dadosAbastecimento.quilometrosRodados,
                        id
                    ]);
                }

                // Atualizar dados específicos de CTRE
                if (data.isCtre && data.dadosCtre) {
                    await t.none(`
                        UPDATE ctre_conhecimento_transporte SET
                            ctre_numero = $1,
                            ctre_serie = $2
                        WHERE ctre_lanc_codigo = $3
                    `, [
                        data.dadosCtre.numeroConhecimento,
                        data.dadosCtre.serieConhecimento,
                        id
                    ]);
                }

                return { success: true };
            });
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Erro ao atualizar lançamento: ${error}`);
        }
    }


    public async deleteLancamento(id: number): Promise<{ success: boolean }> {
        try {
            const lancamento = await this.getLancamentoById(id);
            if (!lancamento) {
                throw new Error('Lançamento não encontrado');
            }
            
            await db.tx(async t => {
                // Deletar dados específicos primeiro (cascade)
                await t.none('DELETE FROM abas_abastecimento WHERE abas_lanc_codigo = $1', [id]);
                await t.none('DELETE FROM ctre_conhecimento_transporte WHERE ctre_lanc_codigo = $1', [id]);
                
                // Deletar lançamento principal
                await t.none('DELETE FROM lanc_lancamento WHERE lanc_codigo = $1', [id]);
            });
            
            return { success: true };
        } catch (error) {
            throw new Error(`Erro ao deletar lançamento: ${error}`);
        }
    }
}


