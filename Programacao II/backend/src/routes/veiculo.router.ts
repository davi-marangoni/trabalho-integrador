import { Router, Request, Response } from 'express';
import { VeiculoController } from '../controller/veiculo.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const veiculoController = new VeiculoController();
const authMiddleware = new AuthMiddleware();

// Todas as rotas requerem autenticação
router.use(authMiddleware.authenticate);

// Rota para buscar tipos de veículos disponíveis (todos os usuários autenticados)
router.get('/tipos', async (req: Request, res: Response) => {
    await veiculoController.getTiposVeiculo(req, res);
});

// Rota para buscar quantidade de veículos por situação (todos os usuários autenticados)
router.get('/situacaocount', async (req: Request, res: Response) => {
    await veiculoController.getVeiculosBySituacaoCount(req, res);
});

// Rotas para usuários autenticados (tipo 1 e 2)
router.get('/', async (req: Request, res: Response) => {
    await veiculoController.getVeiculos(req, res);
});

router.get('/:placa', async (req: Request, res: Response) => {
    await veiculoController.getVeiculoByPlaca(req, res);
});

router.post('/', async (req: Request, res: Response) => {
    await veiculoController.createVeiculo(req, res);
});

router.put('/:placa', async (req: Request, res: Response) => {
    await veiculoController.updateVeiculo(req, res);
});

export default router;
