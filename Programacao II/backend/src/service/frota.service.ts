import { Frota } from '../interface/frota';
import db from '../db/database';

export class FrotaService {

    public async getFrotas(): Promise<Frota[]> {
        try {
            const frotas = await db.any(`
                SELECT
                    ff.frot_codigo as id,
                    cv.cava_veic_placa as placaCavalo,
                    cf.carf_veic_placa as placaCarreta,
                    ff.frot_usua_email as emailUsuarioAdicionou
                FROM frot_frota ff
                LEFT JOIN cava_cavalo cv ON ff.frot_codigo = cv.cava_frot_codigo
                LEFT JOIN carf_carreta_frigorifica cf ON ff.frot_codigo = cf.carf_frot_codigo
                ORDER BY ff.frot_codigo
            `);

            return frotas;
        } catch (error) {
            throw new Error(`Erro ao buscar frotas: ${error}`);
        }
    }

    public async getFrotaById(id: number): Promise<Frota | null> {
        try {
            const frota = await db.oneOrNone(`
                SELECT
                    ff.frot_codigo as id,
                    cv.cava_veic_placa as placaCavalo,
                    cf.carf_veic_placa as placaCarreta,
                    ff.frot_usua_email as emailUsuarioAdicionou
                FROM frot_frota ff
                LEFT JOIN cava_cavalo cv ON ff.frot_codigo = cv.cava_frot_codigo
                LEFT JOIN carf_carreta_frigorifica cf ON ff.frot_codigo = cf.carf_frot_codigo
                WHERE ff.frot_codigo = $1
            `, [id]);

            return frota;
        } catch (error) {
            throw new Error(`Erro ao buscar frota por ID: ${error}`);
        }
    }

    public async createFrota(placaCarreta: string, placaCavalo: string, emailUsuario: string): Promise<{ success: boolean; id?: number }> {
        try {
            // Validações
            await this.validarCriacaoFrota(placaCarreta, placaCavalo);

            // Criar frota na tabela frot_frota
            const novaFrota = await db.one(`
                INSERT INTO frot_frota (frot_usua_email)
                VALUES ($1)
                RETURNING frot_codigo as id
            `, [emailUsuario]);

            // Atualizar cavalo com o código da frota
            await db.none(`
                UPDATE cava_cavalo
                SET cava_frot_codigo = $1
                WHERE cava_veic_placa = $2
            `, [novaFrota.id, placaCavalo]);

            // Atualizar carreta com o código da frota
            await db.none(`
                UPDATE carf_carreta_frigorifica
                SET carf_frot_codigo = $1
                WHERE carf_veic_placa = $2
            `, [novaFrota.id, placaCarreta]);

            return { success: true, id: novaFrota.id };
        } catch (error) {
            throw new Error(`Erro ao criar frota: ${error}`);
        }
    }

    public async deleteFrota(id: number): Promise<{ success: boolean }> {
        try {
            // Verificar se a frota existe
            const frota = await this.getFrotaById(id);
            if (!frota) {
                throw new Error('Frota não encontrada');
            }

            // Remover associação do cavalo
            await db.none(`
                UPDATE cava_cavalo
                SET cava_frot_codigo = NULL
                WHERE cava_frot_codigo = $1
            `, [id]);

            // Remover associação da carreta
            await db.none(`
                UPDATE carf_carreta_frigorifica
                SET carf_frot_codigo = NULL
                WHERE carf_frot_codigo = $1
            `, [id]);

            // Deletar frota
            await db.none(`
                DELETE FROM frot_frota
                WHERE frot_codigo = $1
            `, [id]);

            return { success: true };
        } catch (error) {
            throw new Error(`Erro ao deletar frota: ${error}`);
        }
    }

    private async validarCriacaoFrota(placaCarreta: string, placaCavalo: string): Promise<void> {
        // Verificar se a carreta existe e é do tipo correto
        const carreta = await db.oneOrNone(`
            SELECT v.veic_situacao, cf.carf_veic_placa, cf.carf_frot_codigo
            FROM veic_veiculo v
            JOIN carf_carreta_frigorifica cf ON v.veic_placa = cf.carf_veic_placa
            WHERE v.veic_placa = $1
        `, [placaCarreta]);

        if (!carreta) {
            throw new Error('Carreta não encontrada ou não é uma carreta frigorificada');
        }

        if (carreta.veic_situacao !== 'A') {
            throw new Error('Carreta deve estar ativa para ser associada a uma frota');
        }

        if (carreta.carf_frot_codigo) {
            throw new Error('Carreta já está associada a uma frota');
        }

        // Verificar se o cavalo existe e é do tipo correto
        const cavalo = await db.oneOrNone(`
            SELECT v.veic_situacao, cv.cava_veic_placa, cv.cava_frot_codigo
            FROM veic_veiculo v
            JOIN cava_cavalo cv ON v.veic_placa = cv.cava_veic_placa
            WHERE v.veic_placa = $1
        `, [placaCavalo]);

        if (!cavalo) {
            throw new Error('Cavalo não encontrado ou não é um cavalo');
        }

        if (cavalo.veic_situacao !== 'A') {
            throw new Error('Cavalo deve estar ativo para ser associado a uma frota');
        }

        if (cavalo.cava_frot_codigo) {
            throw new Error('Cavalo já está associado a uma frota');
        }
    }
}
