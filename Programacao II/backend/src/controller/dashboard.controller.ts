import { Request, Response } from 'express';
import { DashboardService } from '../service/dashboard.service';

export class DashboardController {
    private dashboardService: DashboardService;

    constructor() {
        this.dashboardService = new DashboardService();
    }

    /**
     * Busca o total de entradas do mês/ano solicitado
     * Usuários tipo 1 e 2 podem acessar
     */
    public async getTotalEntradas(req: Request, res: Response): Promise<void> {
        try {
            const { mes, ano } = req.query;
            const emailUsuario = req.emailUsuario!;
            const tipoUsuario = req.tipoUsuario!;

            // Validações dos parâmetros
            if (!mes || !ano) {
                res.status(400).json({
                    success: false,
                    message: 'Parâmetros mes e ano são obrigatórios'
                });
                return;
            }

            const mesNum = Number(mes);
            const anoNum = Number(ano);

            // Validação se são números válidos
            if (isNaN(mesNum) || isNaN(anoNum)) {
                res.status(400).json({
                    success: false,
                    message: 'Mês e ano devem ser números válidos'
                });
                return;
            }

            // Validação do mês (1-12)
            if (mesNum < 1 || mesNum > 12) {
                res.status(400).json({
                    success: false,
                    message: 'Mês deve estar entre 1 e 12'
                });
                return;
            }

            // Validação do ano (razoável)
            if (anoNum < 1900 || anoNum > 2100) {
                res.status(400).json({
                    success: false,
                    message: 'Ano deve estar entre 1900 e 2100'
                });
                return;
            }

            const totalEntradas = await this.dashboardService.getTotalEntradas(
                mesNum,
                anoNum,
                tipoUsuario,
                emailUsuario
            );

            res.status(200).json({
                success: true,
                data: {
                    total_entradas: totalEntradas
                },
                message: 'Total de entradas calculado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }

    /**
     * Busca o total de saídas do mês/ano solicitado
     * Usuários tipo 1 e 2 podem acessar
     */
    public async getTotalSaidas(req: Request, res: Response): Promise<void> {
        try {
            const { mes, ano } = req.query;
            const emailUsuario = req.emailUsuario!;
            const tipoUsuario = req.tipoUsuario!;

            // Validações dos parâmetros
            if (!mes || !ano) {
                res.status(400).json({
                    success: false,
                    message: 'Parâmetros mes e ano são obrigatórios'
                });
                return;
            }

            const mesNum = Number(mes);
            const anoNum = Number(ano);

            // Validação se são números válidos
            if (isNaN(mesNum) || isNaN(anoNum)) {
                res.status(400).json({
                    success: false,
                    message: 'Mês e ano devem ser números válidos'
                });
                return;
            }

            // Validação do mês (1-12)
            if (mesNum < 1 || mesNum > 12) {
                res.status(400).json({
                    success: false,
                    message: 'Mês deve estar entre 1 e 12'
                });
                return;
            }

            // Validação do ano (razoável)
            if (anoNum < 1900 || anoNum > 2100) {
                res.status(400).json({
                    success: false,
                    message: 'Ano deve estar entre 1900 e 2100'
                });
                return;
            }

            const totalSaidas = await this.dashboardService.getTotalSaidas(
                mesNum,
                anoNum,
                tipoUsuario,
                emailUsuario
            );

            res.status(200).json({
                success: true,
                data: {
                    total_saidas: totalSaidas
                },
                message: 'Total de saídas calculado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }

    /**
     * Busca o total de entradas e saídas de todos os dias do mês/ano solicitado
     * Usuários tipo 1 e 2 podem acessar
     */
    public async getMovimentacaoTotalDiasMes(req: Request, res: Response): Promise<void> {
        try {
            const { mes, ano } = req.query;
            const emailUsuario = req.emailUsuario!;
            const tipoUsuario = req.tipoUsuario!;

            // Validações dos parâmetros
            if (!mes || !ano) {
                res.status(400).json({
                    success: false,
                    message: 'Parâmetros mes e ano são obrigatórios'
                });
                return;
            }

            const mesNum = Number(mes);
            const anoNum = Number(ano);

            // Validação se são números válidos
            if (isNaN(mesNum) || isNaN(anoNum)) {
                res.status(400).json({
                    success: false,
                    message: 'Mês e ano devem ser números válidos'
                });
                return;
            }

            // Validação do mês (1-12)
            if (mesNum < 1 || mesNum > 12) {
                res.status(400).json({
                    success: false,
                    message: 'Mês deve estar entre 1 e 12'
                });
                return;
            }

            // Validação do ano (razoável)
            if (anoNum < 1900 || anoNum > 2100) {
                res.status(400).json({
                    success: false,
                    message: 'Ano deve estar entre 1900 e 2100'
                });
                return;
            }

            const movimentacaoDias = await this.dashboardService.getMovimentacaoTotalDiasMes(
                mesNum,
                anoNum,
                tipoUsuario,
                emailUsuario
            );

            res.status(200).json({
                success: true,
                data: {
                    dias: movimentacaoDias
                },
                message: 'Movimentação diária calculada com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }
}
