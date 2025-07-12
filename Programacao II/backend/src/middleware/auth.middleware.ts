import { Request, Response, NextFunction } from 'express';
import passport = require('../config/passport.config');
import { Usuario } from '../interface/usuario';

// Extende a interface Request para incluir informações do usuário
declare global {
    namespace Express {
        interface User extends Omit<Usuario, 'senha'> {}
        interface Request {
            emailUsuario?: string;
            tipoUsuario?: number;
        }
    }
}

export class AuthMiddleware {
    /**
     * Middleware para verificar autenticação via JWT usando Passport
     */
    public authenticate = (req: Request, res: Response, next: NextFunction): void => {
        passport.authenticate('jwt', { session: false }, (error: any, user: Express.User | false, info: any) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Erro interno ao validar token',
                    error: error.message
                });
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Token inválido ou expirado'
                });
            }

            // Adiciona o usuário ao request
            req.user = user;
            // Mantém compatibilidade com código existente
            req.emailUsuario = user.email;
            req.tipoUsuario = user.tipo;

            next();
        })(req, res, next);
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
