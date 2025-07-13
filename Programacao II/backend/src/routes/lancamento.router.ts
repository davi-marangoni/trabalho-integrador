import { Router } from 'express';
import { LancamentoController } from '../controller/lancamento.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new LancamentoController();
const auth = new AuthMiddleware();

router.use(auth.authenticate);

router.get('/', (req, res) => controller.getLancamentos(req, res));
router.get('/:id', (req, res) => controller.getLancamentoById(req, res));
router.post('/', (req, res) => controller.createLancamento(req, res));
router.put('/:id', (req, res) => controller.updateLancamento(req, res));
router.delete('/:id', (req, res) => controller.deleteLancamento(req, res));

export default router;
