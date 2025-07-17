import { Request, Response } from 'express';
import { TipoLancamentoService } from '../service/tipolancamento.service';

export class TipoLancamentoController {
    private tipolancamentoService = new TipoLancamentoService();

    constructor() {
        this.tipolancamentoService = new TipoLancamentoService();
    }

    public async getTipoLancamentos(req: Request, res: Response) {
        try {
            const tiposLancamento = await this.tipolancamentoService.getTipoLancamentos();

            res.status(200).json({
                success: true,
                data: tiposLancamento,
                message: 'Tipos de lançamento encontrados com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    public async getTipoLancamentoById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const tipoLancamento = await this.tipolancamentoService.getTipoLancamentoById(id);

            if (!tipoLancamento) {
                res.status(404).json({
                    success: false,
                    message: 'Tipo de lançamento não encontrado'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: tipoLancamento,
                message: 'Tipo de lançamento encontrado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    public async createTipoLancamento(req: Request, res: Response) {
        try {
            const emailUsuario = req.emailUsuario!;
            const dadosTipo = {
                ...req.body,
                emailUsuario
            };

            const result = await this.tipolancamentoService.createTipoLancamento(dadosTipo);

            if (result.success) {
                res.status(201).json({
                    success: true,
                    data: { id: result.id },
                    message: 'Tipo de lançamento criado com sucesso'
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message || 'Erro ao criar tipo de lançamento'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }

    public async updateTipoLancamento(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const result = await this.tipolancamentoService.updateTipoLancamento(id, req.body);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Tipo de lançamento atualizado com sucesso'
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Erro ao atualizar tipo de lançamento'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }

    public async deleteTipoLancamento(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const result = await this.tipolancamentoService.deleteTipoLancamento(id);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Tipo de lançamento deletado com sucesso'
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Erro ao deletar tipo de lançamento'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }
}
