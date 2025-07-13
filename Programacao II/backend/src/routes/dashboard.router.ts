import { Router, Request, Response } from 'express';
import { DashboardController } from '../controller/dashboard.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();
const authMiddleware = new AuthMiddleware();

// Todas as rotas de dashboard precisam de autenticação
// Tanto usuários tipo 1 quanto tipo 2 podem acessar todos os métodos

router.get('/totalentradas',
    authMiddleware.authenticate,
    async (req: Request, res: Response) => {
        await dashboardController.getTotalEntradas(req, res);
    }
);

router.get('/totalsaidas',
    authMiddleware.authenticate,
    async (req: Request, res: Response) => {
        await dashboardController.getTotalSaidas(req, res);
    }
);

router.get('/movimentacaodiaria',
    authMiddleware.authenticate,
    async (req: Request, res: Response) => {
        await dashboardController.getMovimentacaoTotalDiasMes(req, res);
    }
);

export default router;
