import { Request, Response } from 'express';
import { RelatorioService } from '../service/relatorio.service';

export class RelatorioController {
    private relatorioService = new RelatorioService();

    public async gerarRelatorio(req: Request, res: Response) {
        try {
            const filtros = req.query;
            const tipoUsuario = req.user?.tipo ||2;
            const emailUsuario = req.user?.email || '';

            const lancamentos = await this.relatorioService.gerarRelatorioLancamentos(
                filtros,
                tipoUsuario,
                emailUsuario
            );

            const totais = await this.relatorioService.gerarRelatorioTotais(
                filtros,
                tipoUsuario,
                emailUsuario
            );

            res.json({
                success: true,
                data: {
                    lancamentos,
                    totais
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao gerar relatório'
            });
        }
    }
}
