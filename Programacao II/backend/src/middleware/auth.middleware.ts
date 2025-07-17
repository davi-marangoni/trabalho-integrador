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
                    message: `Erro interno ao validar token: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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
            req.emailUsuario = user.email;
            req.tipoUsuario = user.tipo;

            next();
        })(req, res, next);
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
                message: `Erro interno ao verificar autorização de administrador: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    };

}
