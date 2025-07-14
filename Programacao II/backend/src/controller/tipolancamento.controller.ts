import { Request, Response } from 'express';
import { TipoLancamentoService } from '../service/tipolancamento.service';

export class TipoLancamentoController {
    private tipolancamentoService = new TipoLancamentoService();

      constructor() {
            this.tipolancamentoService = new TipoLancamentoService();

        }


    public async getTipoLancamentos(req: Request, res: Response) {
        const transacoes = await this.tipolancamentoService.getTipoLancamentos();
        res.json({ success: true, data: transacoes });
           try{
            const transacoes = await this.tipolancamentoService.getTipoLancamentos();

            res.status(200).json({
                success: true,
                data: transacoes,
                message: 'Tipo de lançamentos encontrados com sucesso'
            });
    } catch (error) {
        res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });}}



    public async getTipoLancamentoById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const tipolancamento = await this.tipolancamentoService.getTipoLancamentoById(id);
        if (tipolancamento) {
            res.json({ success: true, data: tipolancamento });
        } else {
            res.status(404).json({ success: false, message: 'Tipo de lancamento  não encontrado' });
        }
    }

    public async createTipoLancamento(req: Request, res: Response) {
        const result = await this.tipolancamentoService.createTipoLancamento(req.body);
        res.status(201).json({ success: true, id: result.id });
    }

    public async updateTipoLancamento(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.tipolancamentoService.updateTipoLancamento(id, req.body);
        res.json({ success: true });
    }

    public async deleteTipoLancamento(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.tipolancamentoService.deleteTipoLancamento(id);
        res.json({ success: true });
    }
}
