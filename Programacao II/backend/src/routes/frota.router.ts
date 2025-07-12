import { Router, Request, Response } from 'express';
import { FrotaController } from '../controller/frota.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const frotaController = new FrotaController();
const authMiddleware = new AuthMiddleware();

// Todas as rotas de frota precisam de autenticação
// Tanto usuários tipo 1 quanto tipo 2 podem acessar todos os métodos

router.get('/',
    authMiddleware.authenticate,
    async (req: Request, res: Response) => {
        await frotaController.getFrotas(req, res);
    }
);

router.get('/:id',
    authMiddleware.authenticate,
    async (req: Request, res: Response) => {
        await frotaController.getFrotaById(req, res);
    }
);

router.post('/',
    authMiddleware.authenticate,
    async (req: Request, res: Response) => {
        await frotaController.createFrota(req, res);
    }
);

router.delete('/:id',
    authMiddleware.authenticate,
    async (req: Request, res: Response) => {
        await frotaController.deleteFrota(req, res);
    }
);

export default router;
