import express from 'express';
import dotenv from 'dotenv';
import usuarioRouter from './routes/usuario.router';
import veiculoRouter from './routes/veiculo.router';
import { UsuarioService } from './service/usuario.service';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use((req, res, next) => {
    // CORS manual para desenvolvimento
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logs de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rotas da API
app.use('/api/usuarios', usuarioRouter);
app.use('/api/veiculos', veiculoRouter);

// Rota de health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API funcionando corretamente',
        timestamp: new Date().toISOString()
    });
});

// Rota padrão para endpoints não encontrados
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint não encontrado'
    });
});

// Middleware de tratamento de erros
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Erro interno:', error);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
    });
});

// Função para limpeza periódica de tokens expirados
const usuarioService = new UsuarioService();
setInterval(() => {
    usuarioService.cleanExpiredTokens();
}, 60 * 60 * 1000); // Limpa a cada hora

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📋 API disponível em http://localhost:${PORT}`);
    console.log(`🏥 Health check em http://localhost:${PORT}/health`);
    console.log(`👤 Rotas de usuário em http://localhost:${PORT}/api/usuarios`);
    console.log(`🚛 Rotas de veículo em http://localhost:${PORT}/api/veiculos`);
});

export default app;
