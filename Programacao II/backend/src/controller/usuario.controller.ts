//Controller para manipulação de dados do usuário
import { Request, Response } from 'express';
import { UsuarioService } from '../service/usuario.service';
import { AuthService } from '../service/auth.service';

export class UsuarioController {
    private usuarioService: UsuarioService;
    private authService: AuthService;

    constructor() {
        this.usuarioService = new UsuarioService();
        this.authService = new AuthService();
    }

    /**
     * Busca todos os usuários do sistema
     * Apenas administradores (tipo 1) podem acessar
     */
    public async getUsuarios(req: Request, res: Response): Promise<void> {
        try {
            const usuarios = await this.usuarioService.getUsuarios();

            res.status(200).json({
                success: true,
                data: usuarios,
                message: 'Usuários encontrados com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Erro ao buscar usuários: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }

    /**
     * Busca um usuário pelo email
     */
    public async getUsuarioByEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;

            if (!email) {
                res.status(400).json({
                    success: false,
                    message: 'Email é obrigatório'
                });
                return;
            }

            const usuario = await this.usuarioService.getUsuarioByEmail(email);

            if (!usuario) {
                res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
                return;
            }

            // Remove a senha da resposta por segurança
            const { senha: _, ...usuarioResponse } = usuario;

            res.status(200).json({
                success: true,
                data: usuarioResponse,
                message: 'Usuário encontrado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Erro ao buscar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }

    /**
     * Cria um novo usuário no sistema
     * Verifica se o email já existe e criptografa a senha
     */
    public async createUsuario(req: Request, res: Response): Promise<void> {
        try {
            const { email, senha, tipo } = req.body;

            // Validações básicas
            if (!email || !senha || tipo === undefined) {
                res.status(400).json({
                    success: false,
                    message: 'Email, senha e tipo são obrigatórios'
                });
                return;
            }

            // Validação do tipo (1 = Forte, 2 = Fraco)
            if (![1, 2].includes(tipo)) {
                res.status(400).json({
                    success: false,
                    message: 'Tipo deve ser 1 (Forte) ou 2 (Fraco)'
                });
                return;
            }

            // Validação básica do email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({
                    success: false,
                    message: 'Email inválido'
                });
                return;
            }

            // Validação da senha (mínimo 6 caracteres)
            if (senha.length < 6) {
                res.status(400).json({
                    success: false,
                    message: 'Senha deve ter pelo menos 6 caracteres'
                });
                return;
            }

            const usuario = await this.usuarioService.createUsuario(req.body);

            res.status(201).json({
                success: true,
                data: usuario,
                message: 'Usuário criado com sucesso'
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Email já cadastrado no sistema') {
                res.status(409).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: `Erro ao criar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
                });
            }
        }
    }

    /**
     * Atualiza apenas a senha do usuário
     */
    public async updateSenhaUsuario(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            const { novaSenha } = req.body;

            if (!email) {
                res.status(400).json({
                    success: false,
                    message: 'Email é obrigatório'
                });
                return;
            }

            if (!novaSenha) {
                res.status(400).json({
                    success: false,
                    message: 'Nova senha é obrigatória'
                });
                return;
            }

            // Validação da nova senha
            if (novaSenha.length < 6) {
                res.status(400).json({
                    success: false,
                    message: 'Nova senha deve ter pelo menos 6 caracteres'
                });
                return;
            }

            await this.usuarioService.updateSenhaUsuario(email, novaSenha);

            res.status(200).json({
                success: true,
                message: 'Senha atualizada com sucesso'
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuário não encontrado') {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: `Erro ao atualizar senha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
                });
            }
        }
    }

    /**
     * Remove um usuário do sistema
     */
    public async deleteUsuario(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;

            if (!email) {
                res.status(400).json({
                    success: false,
                    message: 'Email é obrigatório'
                });
                return;
            }

            await this.usuarioService.deleteUsuario(email);

            res.status(200).json({
                success: true,
                message: 'Usuário removido com sucesso'
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuário não encontrado') {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: `Erro ao remover usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
                });
            }
        }
    }

    /**
     * Realiza o login do usuário e retorna um token JWT
     */
    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                res.status(400).json({
                    success: false,
                    message: 'Email e senha são obrigatórios'
                });
                return;
            }

            const resultado = await this.authService.login(email, senha);

            if (!resultado) {
                res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: {
                    usuario: resultado.usuario,
                    token: resultado.token
                },
                message: 'Login realizado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Erro ao realizar login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }

    /**
     * Realiza o logout do usuário
     * Com JWT, o logout é tratado pelo cliente removendo o token
     */
    public async logout(req: Request, res: Response): Promise<void> {
        try {
            // Com JWT, não é necessário revogar tokens no servidor
            // O cliente deve simplesmente descartar o token
            res.status(200).json({
                success: true,
                message: 'Logout realizado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Erro ao realizar logout: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }
}
