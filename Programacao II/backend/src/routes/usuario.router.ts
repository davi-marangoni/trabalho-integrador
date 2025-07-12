import { Router, Request, Response } from 'express';
import { UsuarioController } from '../controller/usuario.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const usuarioController = new UsuarioController();
const authMiddleware = new AuthMiddleware();

// Rotas públicas (não precisam de autenticação)
router.post('/login', async (req: Request, res: Response) => {
    await usuarioController.login(req, res);
});

// Rotas protegidas para administradores (tipo 1)
router.get('/',
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
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
    authMiddleware.authorizeAdmin,
    async (req: Request, res: Response) => {
        await usuarioController.getUsuarioByEmail(req, res);
    }
);

router.put('/:email/senha',
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    async (req: Request, res: Response) => {
        await usuarioController.updateSenhaUsuario(req, res);
    }
);

router.delete('/:email',
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    async (req: Request, res: Response) => {
        await usuarioController.deleteUsuario(req, res);
    }
);

// Rota protegida para todos os usuários autenticados
router.post('/logout',
    authMiddleware.authenticate,
    async (req: Request, res: Response) => {
        await usuarioController.logout(req, res);
    }
);

export default router;

















