import { Router } from 'express';
import { TipoLancamentoController } from '../controller/tipolancamento.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new TipoLancamentoController();
const auth = new AuthMiddleware();

router.use(auth.authenticate);

router.get('/', (req, res) => controller.getTipoLancamentos(req, res));
router.get('/:id', (req, res) => controller.getTipoLancamentoById(req, res));
router.post('/', (req, res) => controller.createTipoLancamento(req, res));
router.put('/:id', (req, res) => controller.updateTipoLancamento(req, res));
router.delete('/:id', (req, res) => controller.deleteTipoLancamento(req, res));

export default router;
