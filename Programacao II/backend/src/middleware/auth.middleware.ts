import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../service/usuario.service';

// Extende a interface Request para incluir informações do usuário
declare global {
    namespace Express {
        interface Request {
            emailUsuario?: string;
            tipoUsuario?: number;
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
            req.emailUsuario = validation.email;
            req.tipoUsuario = validation.tipo;

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
            if (req.emailUsuario !== email) {
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
            if (req.tipoUsuario !== 1) {
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

    /**
     * Middleware para autorizar visualização baseada no tipo de usuário
     * - Tipo 1 (admin): pode ver todos os registros
     * - Tipo 2 (comum): só pode ver registros que ele cadastrou
     */
    public authorizeViewAccess = (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Se for administrador (tipo 1), permite acesso total
            if (req.tipoUsuario === 1) {
                next();
                return;
            }

            // Se for usuário comum (tipo 2), adiciona filtro por email do usuário
            // O controller deve usar req.emailUsuario para filtrar resultados
            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro interno ao verificar autorização de visualização',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    };
}
