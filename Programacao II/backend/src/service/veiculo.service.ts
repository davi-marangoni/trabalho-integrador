import { Veiculo, CarretaFrigorificada, VeiculoCavalo } from '../interface/veiculo';
import db from '../db/database';

export class VeiculoService {

    public async getVeiculos(filtros?: { tipo?: number; situacao?: string }): Promise<(Veiculo | CarretaFrigorificada | VeiculoCavalo)[]> {
        try {
            let query = `
                SELECT
                    v.veic_placa,
                    v.veic_modelo,
                    v.veic_renavam,
                    v.veic_situacao,
                    v.veic_tipo,
                    v.veic_ano,
                    v.veic_usua_email,
                    cf.carf_marca_equip_frio,
                    cf.carf_ano_equipamento,
                    cf.carf_qtd_paletes,
                    cf.carf_frot_codigo as carreta_frot_codigo,
                    cv.cava_trucado,
                    cv.cava_frot_codigo as cavalo_frot_codigo
                FROM veic_veiculo v
                LEFT JOIN carf_carreta_frigorifica cf ON v.veic_placa = cf.carf_veic_placa
                LEFT JOIN cava_cavalo cv ON v.veic_placa = cv.cava_veic_placa
                WHERE 1 = 1`;

            const params: any[] = [];
            let paramIndex = 1;

            if (filtros?.tipo) {
                query += ` AND v.veic_tipo = $${paramIndex}`;
                params.push(filtros.tipo);
                paramIndex++;
            }

            if (filtros?.situacao) {
                query += ` AND v.veic_situacao = $${paramIndex}`;
                params.push(filtros.situacao);
                paramIndex++;
            }

            query += ` ORDER BY v.veic_placa`;

            const veiculos = await db.any(query, params);

            return veiculos.map(v => {
                const veiculoBase = {
                    placa: v.veic_placa,
                    modelo: v.veic_modelo,
                    renavam: v.veic_renavam,
                    situacao: v.veic_situacao,
                    tipo: v.veic_tipo,
                    descricaoTipo: this.getTiposVeiculo().find(t => t.id === v.veic_tipo)?.nome || 'Desconhecido',
                    ano: v.veic_ano,
                    emailUsuarioAdicionou: v.veic_usua_email
                };

                // Se for carreta frigorífica (tipo 6)
                if (v.veic_tipo === 6 && v.carf_marca_equip_frio) {
                    return {
                        ...veiculoBase,
                        marcaEquipamentoFrio: v.carf_marca_equip_frio,
                        anoEquipamentoFrio: v.carf_ano_equipamento,
                        quantidadePaletes: v.carf_qtd_paletes,
                        idFrota: v.carreta_frot_codigo
                    } as CarretaFrigorificada;
                }

                // Se for cavalo (tipo 5)
                if (v.veic_tipo === 5 && v.cava_trucado !== null) {
                    return {
                        ...veiculoBase,
                        trucado: v.cava_trucado,
                        idFrota: v.cavalo_frot_codigo
                    } as VeiculoCavalo;
                }

                // Veículo simples
                return veiculoBase;
            });
        } catch (error) {
            throw new Error(`Erro ao buscar veículos: ${error}`);
        }
    }

    public async getVeiculoByPlaca(placa: string): Promise<Veiculo | CarretaFrigorificada | VeiculoCavalo | null> {
        try {
            const veiculo = await db.oneOrNone(`
                SELECT
                    v.veic_placa,
                    v.veic_modelo,
                    v.veic_renavam,
                    v.veic_situacao,
                    v.veic_tipo,
                    v.veic_ano,
                    v.veic_usua_email,
                    cf.carf_marca_equip_frio,
                    cf.carf_ano_equipamento,
                    cf.carf_qtd_paletes,
                    cf.carf_frot_codigo as carreta_frot_codigo,
                    cv.cava_trucado,
                    cv.cava_frot_codigo as cavalo_frot_codigo
                FROM veic_veiculo v
                LEFT JOIN carf_carreta_frigorifica cf ON v.veic_placa = cf.carf_veic_placa
                LEFT JOIN cava_cavalo cv ON v.veic_placa = cv.cava_veic_placa
                WHERE v.veic_placa = $1
            `, [placa]);

            if (!veiculo) return null;

            const veiculoBase = {
                placa: veiculo.veic_placa,
                modelo: veiculo.veic_modelo,
                renavam: veiculo.veic_renavam,
                situacao: veiculo.veic_situacao,
                tipo: veiculo.veic_tipo,
                ano: veiculo.veic_ano,
                emailUsuarioAdicionou: veiculo.veic_usua_email
            };

            // Se for carreta frigorífica (tipo 6)
            if (veiculo.veic_tipo === 6 && veiculo.carf_marca_equip_frio) {
                return {
                    ...veiculoBase,
                    marcaEquipamentoFrio: veiculo.carf_marca_equip_frio,
                    anoEquipamentoFrio: veiculo.carf_ano_equipamento,
                    quantidadePaletes: veiculo.carf_qtd_paletes,
                    idFrota: veiculo.carreta_frot_codigo
                } as CarretaFrigorificada;
            }

            // Se for cavalo (tipo 5)
            if (veiculo.veic_tipo === 5 && veiculo.cava_trucado !== null) {
                return {
                    ...veiculoBase,
                    trucado: veiculo.cava_trucado,
                    idFrota: veiculo.cavalo_frot_codigo
                } as VeiculoCavalo;
            }

            // Veículo simples
            return veiculoBase;
        } catch (error) {
            throw new Error(`Erro ao buscar veículo por placa: ${error}`);
        }
    }

    public async createVeiculo(dadosVeiculo: any): Promise<{ success: boolean; placa?: string }> {
        try {
            const { placa, modelo, renavam, situacao, tipo, ano, emailUsuarioAdicionou } = dadosVeiculo;

            const veiculoExistente = await this.getVeiculoByPlaca(placa);
            if (veiculoExistente) {
                throw new Error('Veículo com esta placa já está cadastrado');
            }

            return await db.tx(async t => {
                // Primeiro, cadastra o veículo base (comum a todos os tipos)
                await t.none(`
                    INSERT INTO veic_veiculo (
                        veic_placa, veic_modelo, veic_renavam, veic_situacao,
                        veic_tipo, veic_ano, veic_usua_email
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [placa, modelo, renavam, situacao, tipo, ano, emailUsuarioAdicionou]);

                if (tipo === 6) {
                    // Carreta frigorífica
                    const { marcaEquipamentoFrio, anoEquipamentoFrio, quantidadePaletes, idFrota } = dadosVeiculo;
                    await t.none(`
                        INSERT INTO carf_carreta_frigorifica (
                            carf_veic_placa, carf_marca_equip_frio, carf_ano_equipamento,
                            carf_qtd_paletes, carf_frot_codigo
                        ) VALUES ($1, $2, $3, $4, $5)
                    `, [placa, marcaEquipamentoFrio, anoEquipamentoFrio, quantidadePaletes, idFrota]);
                } else if (tipo === 5) {
                    // Cavalo
                    const { trucado, idFrota } = dadosVeiculo;
                    await t.none(`
                        INSERT INTO cava_cavalo (
                            cava_veic_placa, cava_trucado, cava_frot_codigo
                        ) VALUES ($1, $2, $3)
                    `, [placa, trucado, idFrota]);
                }

                return { success: true, placa };
            });
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Erro ao criar veículo: ${error}`);
        }
    }

    public async updateVeiculo(placa: string, dadosVeiculo: any): Promise<{ success: boolean; placa?: string }> {
        try {
            const veiculoExistente = await this.getVeiculoByPlaca(placa);
            if (!veiculoExistente) {
                throw new Error('Veículo não encontrado');
            }

            if (dadosVeiculo.situacao && dadosVeiculo.situacao !== veiculoExistente.situacao) {
                const associadoFrota = await this.verificarAssociacaoFrota(placa);
                if (associadoFrota) {
                    throw new Error('Não é possível alterar a situação de um veículo que está associado a uma frota');
                }
            }

            return await db.tx(async t => {
                // Atualizar campos da tabela principal veic_veiculo
                const camposVeiculo = [];
                const valoresVeiculo = [];

                if (dadosVeiculo.modelo !== undefined) {
                    camposVeiculo.push('veic_modelo = $' + (camposVeiculo.length + 1));
                    valoresVeiculo.push(dadosVeiculo.modelo);
                }
                if (dadosVeiculo.renavam !== undefined) {
                    camposVeiculo.push('veic_renavam = $' + (camposVeiculo.length + 1));
                    valoresVeiculo.push(dadosVeiculo.renavam);
                }
                if (dadosVeiculo.situacao !== undefined) {
                    camposVeiculo.push('veic_situacao = $' + (camposVeiculo.length + 1));
                    valoresVeiculo.push(dadosVeiculo.situacao);
                }
                if (dadosVeiculo.ano !== undefined) {
                    camposVeiculo.push('veic_ano = $' + (camposVeiculo.length + 1));
                    valoresVeiculo.push(dadosVeiculo.ano);
                }

                // Atualizar tabela principal se houver campos para atualizar
                if (camposVeiculo.length > 0) {
                    valoresVeiculo.push(placa);
                    await t.none(`
                        UPDATE veic_veiculo
                        SET ${camposVeiculo.join(', ')}
                        WHERE veic_placa = $${valoresVeiculo.length}
                    `, valoresVeiculo);
                }

                // Atualizar campos específicos se for Carreta Frigorificada (tipo 6)
                if (veiculoExistente.tipo === 6) {
                    const camposCarreta = [];
                    const valoresCarreta = [];

                    if (dadosVeiculo.marcaEquipamentoFrio !== undefined) {
                        camposCarreta.push('carf_marca_equip_frio = $' + (camposCarreta.length + 1));
                        valoresCarreta.push(dadosVeiculo.marcaEquipamentoFrio);
                    }
                    if (dadosVeiculo.anoEquipamentoFrio !== undefined) {
                        camposCarreta.push('carf_ano_equipamento = $' + (camposCarreta.length + 1));
                        valoresCarreta.push(dadosVeiculo.anoEquipamentoFrio);
                    }
                    if (dadosVeiculo.quantidadePaletes !== undefined) {
                        camposCarreta.push('carf_qtd_paletes = $' + (camposCarreta.length + 1));
                        valoresCarreta.push(dadosVeiculo.quantidadePaletes);
                    }
                    if (dadosVeiculo.idFrota !== undefined) {
                        camposCarreta.push('carf_frot_codigo = $' + (camposCarreta.length + 1));
                        valoresCarreta.push(dadosVeiculo.idFrota);
                    }

                    if (camposCarreta.length > 0) {
                        valoresCarreta.push(placa);
                        await t.none(`
                            UPDATE carf_carreta_frigorifica
                            SET ${camposCarreta.join(', ')}
                            WHERE carf_veic_placa = $${valoresCarreta.length}
                        `, valoresCarreta);
                    }
                }

                // Atualizar campos específicos se for Cavalinho (tipo 5)
                if (veiculoExistente.tipo === 5) {
                    const camposCavalo = [];
                    const valoresCavalo = [];

                    if (dadosVeiculo.trucado !== undefined) {
                        camposCavalo.push('cava_trucado = $' + (camposCavalo.length + 1));
                        valoresCavalo.push(dadosVeiculo.trucado);
                    }
                    if (dadosVeiculo.idFrota !== undefined) {
                        camposCavalo.push('cava_frot_codigo = $' + (camposCavalo.length + 1));
                        valoresCavalo.push(dadosVeiculo.idFrota);
                    }

                    if (camposCavalo.length > 0) {
                        valoresCavalo.push(placa);
                        await t.none(`
                            UPDATE cava_cavalo
                            SET ${camposCavalo.join(', ')}
                            WHERE cava_veic_placa = $${valoresCavalo.length}
                        `, valoresCavalo);
                    }
                }

                // Verificar se pelo menos um campo foi fornecido para atualização
                if (camposVeiculo.length === 0 &&
                    (veiculoExistente.tipo !== 6 || (dadosVeiculo.marcaEquipamentoFrio === undefined &&
                    dadosVeiculo.anoEquipamentoFrio === undefined && dadosVeiculo.quantidadePaletes === undefined &&
                    dadosVeiculo.idFrota === undefined)) &&
                    (veiculoExistente.tipo !== 5 || (dadosVeiculo.trucado === undefined &&
                    dadosVeiculo.idFrota === undefined))) {
                    throw new Error('Nenhum campo fornecido para atualização');
                }

                return { success: true, placa };
            });
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Erro ao atualizar veículo: ${error}`);
        }
    }

    private async verificarAssociacaoFrota(placa: string): Promise<boolean> {
        try {
            const carreta = await db.oneOrNone(
                'SELECT 1 FROM carf_carreta_frigorifica WHERE carf_veic_placa = $1 and carf_frot_codigo IS NOT NULL',
                [placa]
            );

            const cavalo = await db.oneOrNone(
                'SELECT 1 FROM cava_cavalo WHERE cava_veic_placa = $1 and cava_frot_codigo IS NOT NULL',
                [placa]
            );

            return !!(carreta || cavalo);
        } catch (error) {
            throw new Error(`Erro ao verificar associação com frota: ${error}`);
        }
    }

    public getTiposVeiculo(): { id: number; nome: string; temAtributosEspecificos: boolean }[] {
        return [
            { id: 1, nome: 'Veículo de Passeio', temAtributosEspecificos: false },
            { id: 2, nome: 'Moto', temAtributosEspecificos: false },
            { id: 3, nome: 'Truck', temAtributosEspecificos: false },
            { id: 4, nome: 'Caçamba', temAtributosEspecificos: false },
            { id: 5, nome: 'Cavalinho', temAtributosEspecificos: true },
            { id: 6, nome: 'Carreta Frigorificada', temAtributosEspecificos: true }
        ];
    }

    public getVeiculosBySituacaoCount(situacao?: string): Promise<number> {
        let query = `
                SELECT COUNT(veic_placa) FROM veic_veiculo
                WHERE 1 = 1
            `;

            if (situacao) {
                query += ` AND veic_situacao = $1`;
            }

        return db.one(query, [situacao])
            .then(result => parseInt(result.count, 10))
            .catch(error => {
                throw new Error(`Erro ao contar veículos por situação: ${error}`);
            }
        );
    }
}
