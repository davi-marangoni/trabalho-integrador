import { Router, Request, Response, NextFunction } from 'express';
import { UsuarioController } from '../controller/usuario.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const usuarioController = new UsuarioController();
const authMiddleware = new AuthMiddleware();

// Rotas públicas (não precisam de autenticação)
router.post('/login', async (req: Request, res: Response) => {
    await usuarioController.login(req, res);
});

router.post('/validate-token', async (req: Request, res: Response) => {
    await usuarioController.validateToken(req, res);
});

// Rotas protegidas (precisam de autenticação)
router.get('/',
    authMiddleware.authenticate,
    authMiddleware.authorizeViewAccess,
    async (req: Request, res: Response) => {
        await usuarioController.getUsuarios(req, res);
    }
);

router.post('/register',
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    async (req: Request, res: Response) => {
        await usuarioController.createUsuario(req, res);
    }
);

router.get('/:email',
    authMiddleware.authenticate,
    authMiddleware.authorizeOwner,
    async (req: Request, res: Response) => {
        await usuarioController.getUsuarioByEmail(req, res);
    }
);

router.put('/:email/senha',
    authMiddleware.authenticate,
    authMiddleware.authorizeOwner,
    async (req: Request, res: Response) => {
        await usuarioController.updateSenhaUsuario(req, res);
    }
);

router.delete('/:email',
    authMiddleware.authenticate,
    authMiddleware.authorizeOwner,
    async (req: Request, res: Response) => {
        await usuarioController.deleteUsuario(req, res);
    }
);

router.post('/logout',
    authMiddleware.authenticate,
    async (req: Request, res: Response) => {
        await usuarioController.logout(req, res);
    }
);

export default router;

















