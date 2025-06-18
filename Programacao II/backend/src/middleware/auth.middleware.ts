import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../service/usuario.service';

// Extende a interface Request para incluir informações do usuário
declare global {
    namespace Express {
        interface Request {
            userEmail?: string;
            userTipo?: number;
        }
    }
}

export class AuthMiddleware {
    private usuarioService: UsuarioService;

    constructor() {
        this.usuarioService = new UsuarioService();
    }

    /**
     * Middleware para verificar autenticação via token
     */
    public authenticate = (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Busca o token no header Authorization
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                res.status(401).json({
                    success: false,
                    message: 'Token de acesso requerido. Use o header Authorization: Bearer <token>'
                });
                return;
            }

            // Extrai o token do formato "Bearer <token>"
            const token = authHeader.replace('Bearer ', '');

            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Formato do token inválido. Use: Bearer <token>'
                });
                return;
            }

            // Valida o token
            const validation = this.usuarioService.validateToken(token);

            if (!validation.valid) {
                res.status(401).json({
                    success: false,
                    message: 'Token inválido ou expirado'
                });
                return;
            }

            // Adiciona o email e tipo do usuário ao request para uso nas rotas
            req.userEmail = validation.email;
            req.userTipo = validation.tipo;

            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro interno ao validar token',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    };

    /**
     * Middleware para verificar se o usuário pode acessar apenas seus próprios dados
     */
    public authorizeOwner = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const { email } = req.params;

            // Verifica se o usuário está tentando acessar seus próprios dados
            if (req.userEmail !== email) {
                res.status(403).json({
                    success: false,
                    message: 'Acesso negado. Você só pode acessar seus próprios dados'
                });
                return;
            }

            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro interno ao verificar autorização',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    };

    /**
     * Middleware para verificar se o usuário é do tipo 1 (administrador)
     */
    public authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Verifica se o usuário é do tipo 1 (administrador)
            if (req.userTipo !== 1) {
                res.status(403).json({
                    success: false,
                    message: 'Acesso negado. Apenas usuários administradores podem realizar esta ação'
                });
                return;
            }

            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro interno ao verificar autorização de administrador',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    };
}
