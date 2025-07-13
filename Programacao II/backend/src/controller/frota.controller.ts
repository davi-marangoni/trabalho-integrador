import { Request, Response } from 'express';
import { FrotaService } from '../service/frota.service';

export class FrotaController {
    private frotaService = new FrotaService();

     constructor() {
                this.frotaService = new FrotaService();

            }

    /**
     * Busca todas as frotas do sistema
     * Usuários tipo 1 e 2 podem acessar
     */
    public async getFrotas(req: Request, res: Response): Promise<void> {
        try {
            const frotas = await this.frotaService.getFrotas();

            res.status(200).json({
                success: true,
                data: frotas,
                message: 'Frotas encontradas com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    /**
     * Busca uma frota específica por ID
     * Usuários tipo 1 e 2 podem acessar
     */
    public async getFrotaById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID da frota inválido'
                });
                return;
            }

            const frota = await this.frotaService.getFrotaById(id);

            if (!frota) {
                res.status(404).json({
                    success: false,
                    message: 'Frota não encontrada'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: frota,
                message: 'Frota encontrada com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    /**
     * Cria uma nova frota
     * Usuários tipo 1 e 2 podem acessar
     */
    public async createFrota(req: Request, res: Response): Promise<void> {
        try {
            const { placaCarreta, placaCavalo } = req.body;

            // Validações básicas
            if (!placaCarreta || !placaCavalo) {
                res.status(400).json({
                    success: false,
                    message: 'Placa da carreta e placa do cavalo são obrigatórias'
                });
                return;
            }

            if (!req.emailUsuario) {
                res.status(401).json({
                    success: false,
                    message: 'Usuário não autenticado'
                });
                return;
            }

            const resultado = await this.frotaService.createFrota(placaCarreta, placaCavalo, req.emailUsuario);

            res.status(201).json({
                success: true,
                data: { id: resultado.id },
                message: 'Frota criada com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    /**
     * Deleta uma frota
     * Usuários tipo 1 e 2 podem acessar
     */
    public async deleteFrota(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID da frota inválido'
                });
                return;
            }

            await this.frotaService.deleteFrota(id);

            res.status(200).json({
                success: true,
                message: 'Frota deletada com sucesso'
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('não encontrada')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        }
    }
}
