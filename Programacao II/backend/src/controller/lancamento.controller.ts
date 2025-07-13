import { Request, Response } from 'express';
import { LancamentoService } from '../service/lancamento.service';

export class LancamentoController {
    private lancamentoService = new LancamentoService();

     constructor() {
                this.lancamentoService = new LancamentoService();

            }

    public async getLancamentos(req: Request, res: Response) {
        const transacoes = await this.lancamentoService.getLancamentos();
        res.json({ success: true, data: transacoes });
    }

    public async getLancamentoById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const lancamento = await this.lancamentoService.getLancamentoById(id);
        if (lancamento) {
            res.json({ success: true, data: lancamento });
        } else {
            res.status(404).json({ success: false, message: 'Transação não encontrada' });
        }
    }

    public async createLancamento(req: Request, res: Response) {
        const result = await this.lancamentoService.createLancamento(req.body);
        res.status(201).json({ success: true, id: result.id });
    }

    public async updateLancamento(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.lancamentoService.updateLancamento(id, req.body);
        res.json({ success: true });
    }

    public async deleteLancamento(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.lancamentoService.deleteLancamento(id);
        res.json({ success: true });
    }
}
