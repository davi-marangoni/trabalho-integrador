import db from '../db/database';

export interface MovimentacaoDiaria {
    dia: string;
    total_entradas: number;
    total_saidas: number;
}

export class DashboardService {

    /**
     * Busca o total de entradas do mês/ano
     * @param mes Mês (1-12)
     * @param ano Ano
     * @param tipoUsuario Tipo do usuário (1 = Administrador, 2 = Operador)
     * @param emailUsuario Email do usuário logado
     */
    public async getTotalEntradas(mes: number, ano: number, tipoUsuario: number, emailUsuario: string): Promise<number> {
        try {
            let query = `
                SELECT
                    COALESCE(SUM(lanc_valor), 0) AS total_entradas
                FROM
                    lanc_lancamento
                JOIN
                    tipl_tipo_lancamento ON lanc_tipl_codigo = tipl_codigo
                WHERE
                    tipl_tipo = 1
                    AND EXTRACT(MONTH FROM lanc_data) = $1
                    AND EXTRACT(YEAR FROM lanc_data) = $2
            `;

            const params: any[] = [mes, ano];

            // Se usuário tipo 2, adiciona filtro por email
            if (tipoUsuario === 2) {
                query += ` AND lanc_usua_email = $3`;
                params.push(emailUsuario);
            }

            const resultado = await db.one(query, params);
            return parseFloat(resultado.total_entradas) || 0;
        } catch (error) {
            throw new Error(`Erro ao buscar total de entradas: ${error}`);
        }
    }

    /**
     * Busca o total de saídas do mês/ano
     * @param mes Mês (1-12)
     * @param ano Ano
     * @param tipoUsuario Tipo do usuário (1 = Administrador, 2 = Operador)
     * @param emailUsuario Email do usuário logado
     */
    public async getTotalSaidas(mes: number, ano: number, tipoUsuario: number, emailUsuario: string): Promise<number> {
        try {
            let query = `
                SELECT
                    COALESCE(SUM(lanc_valor), 0) AS total_saidas
                FROM
                    lanc_lancamento
                JOIN
                    tipl_tipo_lancamento ON lanc_tipl_codigo = tipl_codigo
                WHERE
                    tipl_tipo = 2
                    AND EXTRACT(MONTH FROM lanc_data) = $1
                    AND EXTRACT(YEAR FROM lanc_data) = $2
            `;

            const params: any[] = [mes, ano];

            // Se usuário tipo 2, adiciona filtro por email
            if (tipoUsuario === 2) {
                query += ` AND lanc_usua_email = $3`;
                params.push(emailUsuario);
            }

            const resultado = await db.one(query, params);
            return parseFloat(resultado.total_saidas) || 0;
        } catch (error) {
            throw new Error(`Erro ao buscar total de saídas: ${error}`);
        }
    }

    /**
     * Busca a movimentação diária de entradas e saídas do mês/ano
     * @param mes Mês (1-12)
     * @param ano Ano
     * @param tipoUsuario Tipo do usuário (1 = Administrador, 2 = Operador)
     * @param emailUsuario Email do usuário logado
     */
    public async getMovimentacaoTotalDiasMes(
        mes: number,
        ano: number,
        tipoUsuario: number,
        emailUsuario: string
    ): Promise<MovimentacaoDiaria[]> {
        try {
            let query = `
                WITH dias_do_mes AS (
                    SELECT generate_series(
                        DATE_TRUNC('month', TO_DATE($1 || '-' || $2, 'YYYY-MM')),
                        DATE_TRUNC('month', TO_DATE($1 || '-' || $2, 'YYYY-MM')) + INTERVAL '1 month - 1 day',
                        INTERVAL '1 day'
                    )::date AS dia
                ),
                entradas_saidas_por_dia AS (
                    SELECT
                        lanc_data::date AS dia,
                        CASE WHEN tipl_tipo = 1 THEN lanc_valor ELSE 0 END AS entrada,
                        CASE WHEN tipl_tipo = 2 THEN lanc_valor ELSE 0 END AS saida
                    FROM lanc_lancamento
                    JOIN tipl_tipo_lancamento ON lanc_tipl_codigo = tipl_codigo
                    WHERE
                        EXTRACT(MONTH FROM lanc_data) = $2
                        AND EXTRACT(YEAR FROM lanc_data) = $1
            `;

            const params: any[] = [ano, mes];

            // Se usuário tipo 2, adiciona filtro por email
            if (tipoUsuario === 2) {
                query += ` AND lanc_usua_email = $3`;
                params.push(emailUsuario);
            }

            query += `
                )
                SELECT
                    TO_CHAR(d.dia, 'DD/MM') AS dia,
                    COALESCE(SUM(e.entrada), 0) AS total_entradas,
                    COALESCE(SUM(e.saida), 0) AS total_saidas
                FROM
                    dias_do_mes d
                LEFT JOIN entradas_saidas_por_dia e ON e.dia = d.dia
                GROUP BY d.dia
                ORDER BY d.dia
            `;

            const resultados = await db.any(query, params);

            return resultados.map(row => ({
                dia: row.dia,
                total_entradas: parseFloat(row.total_entradas) || 0,
                total_saidas: parseFloat(row.total_saidas) || 0
            }));
        } catch (error) {
            throw new Error(`Erro ao buscar movimentação diária: ${error}`);
        }
    }
}
