import db from '../db/database';
import { RelatorioLancamento, RelatorioFiltros } from '../interface/relatorio';

export class RelatorioService {
    public async gerarRelatorioLancamentos(
        filtros: RelatorioFiltros,
        tipoUsuario: number,
        emailUsuario: string
    ): Promise<RelatorioLancamento[]> {
        try {
            let query = `
                SELECT
                    l.lanc_codigo as id,
                    l.lanc_valor as valor,
                    l.lanc_data as data,
                    t.tipl_tipo as tipo,
                    t.tipl_descricao as descricao,
                    l.lanc_veic_placa as placa_veiculo,
                    l.lanc_usua_email as email_usuario
                FROM lanc_lancamento l
                JOIN tipl_tipo_lancamento t ON l.lanc_tipl_codigo = t.tipl_codigo
                WHERE 1=1
            `;

            const params: any[] = [];
            let paramCount = 1;

            if (filtros.dataInicio) {
                query += ` AND l.lanc_data >= $${paramCount}`;
                params.push(filtros.dataInicio);
                paramCount++;
            }

            if (filtros.dataFim) {
                query += ` AND l.lanc_data <= $${paramCount}`;
                params.push(filtros.dataFim);
                paramCount++;
            }

            if (filtros.tipo) {
                query += ` AND t.tipl_tipo = $${paramCount}`;
                params.push(filtros.tipo);
                paramCount++;
            }

            if (filtros.placaVeiculo) {
                query += ` AND l.lanc_veic_placa = $${paramCount}`;
                params.push(filtros.placaVeiculo);
                paramCount++;
            }

            if (filtros.idTipoLancamento) {
                query += ` AND l.lanc_tipl_codigo = $${paramCount}`;
                params.push(filtros.idTipoLancamento);
                paramCount++;
            }

            // Se usuário tipo 2, filtra apenas seus lançamentos
            if (tipoUsuario === 2) {
                query += ` AND l.lanc_usua_email = $${paramCount}`;
                params.push(emailUsuario);
            }

            query += ` ORDER BY l.lanc_data DESC`;

            return await db.any(query, params);
        } catch (error) {
            throw new Error(`Erro ao gerar relatório: ${error}`);
        }
    }

    public async gerarRelatorioTotais(
        filtros: RelatorioFiltros,
        tipoUsuario: number,
        emailUsuario: string
    ) {
        try {
            let query = `
                SELECT
                    COUNT(*) as total_lancamentos,
                    SUM(CASE WHEN t.tipl_tipo = 1 THEN l.lanc_valor ELSE 0 END) as total_entradas,
                    SUM(CASE WHEN t.tipl_tipo = 2 THEN l.lanc_valor ELSE 0 END) as total_saidas
                FROM lanc_lancamento l
                JOIN tipl_tipo_lancamento t ON l.lanc_tipl_codigo = t.tipl_codigo
                WHERE 1=1
            `;

            // Mesma lógica de filtros do método anterior
            // ...
            const params: any[] = [];
            let paramCount = 1;
            if (filtros.dataInicio) {
                query += ` AND l.lanc_data >= $${paramCount}`;
                params.push(filtros.dataInicio);
                paramCount++;
            }
            if (filtros.dataFim) {
                query += ` AND l.lanc_data <= $${paramCount}`;
                params.push(filtros.dataFim);
                paramCount++;
            }

            if (filtros.tipo) {
                query += ` AND t.tipl_tipo = $${paramCount}`;
                params.push(filtros.tipo);
                paramCount++;
            }
            if (filtros.placaVeiculo) {
                query += ` AND l.lanc_veic_placa = $${paramCount}`;
                params.push(filtros.placaVeiculo);
                paramCount++;
            }

            if (filtros.idTipoLancamento) {
                query += ` AND l.lanc_tipl_codigo = $${paramCount}`;
                params.push(filtros.idTipoLancamento);
                paramCount++;
            }
            // Se usuário tipo 2, filtra apenas seus lançamentos
            if (tipoUsuario === 2) {
                query += ` AND l.lanc_usua_email = $${paramCount}`;
                params.push(emailUsuario);
            }
            query += ` ORDER BY l.lanc_data DESC`;
            query += ` LIMIT 1`; // Para garantir que só retornará uma linha
            query += ` OFFSET 0`; // Para garantir que só retornará uma linha
            // Executa a consulta e retorna os totais
            return await db.one(query, params);
        } catch (error) {
            throw new Error(`Erro ao gerar totais: ${error}`);
        }
    }
}
