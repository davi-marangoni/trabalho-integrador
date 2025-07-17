import { Router } from 'express';
import { RelatorioController } from '../controller/relatorio.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new RelatorioController();
const auth = new AuthMiddleware();

router.use(auth.authenticate);

router.get('/', (req, res) => controller.gerarRelatorio(req, res));

export default router;
