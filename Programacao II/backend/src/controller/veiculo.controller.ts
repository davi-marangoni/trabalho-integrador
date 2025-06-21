import { Request, Response } from 'express';
import { VeiculoService } from '../service/veiculo.service';

export class VeiculoController {
    private veiculoService: VeiculoService;

    constructor() {
        this.veiculoService = new VeiculoService();
    }

    public async getVeiculos(req: Request, res: Response): Promise<void> {
        try {
            const veiculos = await this.veiculoService.getVeiculos();

            res.status(200).json({
                success: true,
                data: veiculos,
                message: 'Veículos encontrados com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar veículos',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    public async getVeiculoByPlaca(req: Request, res: Response): Promise<void> {
        try {
            const { placa } = req.params;

            if (!placa) {
                res.status(400).json({
                    success: false,
                    message: 'Placa é obrigatória'
                });
                return;
            }

            const veiculo = await this.veiculoService.getVeiculoByPlaca(placa);

            if (!veiculo) {
                res.status(404).json({
                    success: false,
                    message: 'Veículo não encontrado'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: veiculo,
                message: 'Veículo encontrado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar veículo',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    public async createVeiculo(req: Request, res: Response): Promise<void> {
        try {
            const emailUsuario = req.emailUsuario!;
            const dadosVeiculo = {
                ...req.body,
                placa: req.body.placa?.toUpperCase(),
                emailUsuarioAdicionou: emailUsuario
            };

            // Validações básicas
            if (!dadosVeiculo.placa || !dadosVeiculo.situacao || dadosVeiculo.tipo === undefined) {
                res.status(400).json({
                    success: false,
                    message: 'Placa, situação e tipo são obrigatórios'
                });
                return;
            }

            // Validação da situação
            if (!['A', 'I'].includes(dadosVeiculo.situacao)) {
                res.status(400).json({
                    success: false,
                    message: 'Situação deve ser A (Ativo) ou I (Inativo)'
                });
                return;
            }

            // Validação do tipo
            const tiposValidos = this.veiculoService.getTiposVeiculo();
            if (!tiposValidos.some(t => t.id === dadosVeiculo.tipo)) {
                res.status(400).json({
                    success: false,
                    message: 'Tipo de veículo inválido'
                });
                return;
            }

            // Validações específicas para cavalo
            if (dadosVeiculo.tipo === 5) {
                if (dadosVeiculo.trucado && !['S', 'N'].includes(dadosVeiculo.trucado)) {
                    res.status(400).json({
                        success: false,
                        message: 'Trucado deve ser S (Sim) ou N (Não)'
                    });
                    return;
                }
                dadosVeiculo.trucado = dadosVeiculo.trucado || 'N';
            }

            const resultado = await this.veiculoService.createVeiculo(dadosVeiculo);

            res.status(201).json({
                success: true,
                data: { placa: resultado.placa },
                message: 'Veículo criado com sucesso'
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('já está cadastrado')) {
                res.status(409).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Erro ao criar veículo',
                    error: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        }
    }

    public async updateVeiculo(req: Request, res: Response): Promise<void> {
        try {
            const { placa } = req.params;

            if (!placa) {
                res.status(400).json({
                    success: false,
                    message: 'Placa é obrigatória'
                });
                return;
            }

            // Validação da situação se fornecida
            if (req.body.situacao && !['A', 'I'].includes(req.body.situacao)) {
                res.status(400).json({
                    success: false,
                    message: 'Situação deve ser A (Ativo) ou I (Inativo)'
                });
                return;
            }

            const resultado = await this.veiculoService.updateVeiculo(placa, req.body);

            res.status(200).json({
                success: true,
                data: { placa: resultado.placa },
                message: 'Veículo atualizado com sucesso'
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('não encontrado')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else if (error instanceof Error && error.message.includes('associado a uma frota')) {
                res.status(409).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Erro ao atualizar veículo',
                    error: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        }
    }

    public async getTiposVeiculo(req: Request, res: Response): Promise<void> {
        try {
            const tipos = this.veiculoService.getTiposVeiculo();

            res.status(200).json({
                success: true,
                data: tipos,
                message: 'Tipos de veículo encontrados com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar tipos de veículo',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }
}
