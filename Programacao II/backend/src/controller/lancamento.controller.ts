import { Request, Response } from 'express';
import { LancamentoService } from '../service/lancamento.service';

export class LancamentoController {
    private lancamentoService = new LancamentoService();

    constructor() {
        this.lancamentoService = new LancamentoService();
    }

    public async getLancamentos(req: Request, res: Response) {
        try {
            const lancamentos = await this.lancamentoService.getLancamentos();

            res.status(200).json({
                success: true,
                data: lancamentos,
                message: 'Lançamentos encontrados com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    public async getLancamentoById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const lancamento = await this.lancamentoService.getLancamentoById(id);

            if (!lancamento) {
                res.status(404).json({
                    success: false,
                    message: 'Lançamento não encontrado'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: lancamento,
                message: 'Lançamento encontrado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    public async createLancamento(req: Request, res: Response) {
        try {
            const emailUsuario = req.emailUsuario!;
            const dadosLancamento = {
                ...req.body,
                emailUsuarioAdicionou: emailUsuario
            };

            const result = await this.lancamentoService.createLancamento(dadosLancamento);
            
            if (result.success) {
                res.status(201).json({ 
                    success: true, 
                    data: { id: result.id },
                    message: 'Lançamento criado com sucesso'
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message || 'Erro ao criar lançamento'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }

    public async updateLancamento(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const result = await this.lancamentoService.updateLancamento(id, req.body);
            
            res.status(200).json({
                success: true,
                message: 'Lançamento atualizado com sucesso'
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('não encontrado')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Erro interno do servidor'
                });
            }
        }
    }

    public async deleteLancamento(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await this.lancamentoService.deleteLancamento(id);
            
            res.status(200).json({
                success: true,
                message: 'Lançamento deletado com sucesso'
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('não encontrado')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Erro interno do servidor'
                });
            }
        }
    }
}
