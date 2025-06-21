import { Usuario } from '../interface/usuario';
import db from '../db/database';
import crypto from 'crypto';

// Interface para o token de sessão
interface TokenSessao {
    token: string;
    email: string;
    tipo: number;
    expiraEm: Date;
}

// Armazenamento simples de tokens em memória (em produção, usar Redis ou banco)
const tokensAtivos = new Map<string, TokenSessao>();

export class UsuarioService {

    /**
     * Busca todos os usuários do sistema
     */
    public async getUsuarios(): Promise<Usuario[]> {
        try {
            const usuarios = await db.any('SELECT usua_email as email, usua_tipo_usuario as tipo FROM usua_usuario');
            return usuarios;
        } catch (error) {
            throw new Error(`Erro ao buscar usuários: ${error}`);
        }
    }

    /**
     * Busca um usuário pelo email
     */
    public async getUsuarioByEmail(email: string): Promise<Usuario | null> {
        try {
            const usuario = await db.oneOrNone(
                'SELECT usua_email as email, usua_senha as senha, usua_tipo_usuario as tipo FROM usua_usuario WHERE usua_email = $1',
                [email]
            );
            return usuario;
        } catch (error) {
            throw new Error(`Erro ao buscar usuário por email: ${error}`);
        }
    }

    /**
     * Cria um novo usuário no sistema
     * Verifica se o email já existe e criptografa a senha em SHA256
     */
    public async createUsuario(dadosUsuario: Usuario): Promise<Omit<Usuario, 'senha'>> {
        try {
            const { email, senha, tipo } = dadosUsuario;

            // Verifica se o email já existe
            const usuarioExistente = await this.getUsuarioByEmail(email);
            if (usuarioExistente) {
                throw new Error('Email já cadastrado no sistema');
            }

            // Criptografa a senha em SHA256
            const senhaCriptografada = crypto.createHash('sha256').update(senha).digest('hex');

            // Insere o novo usuário no banco
            const novoUsuario = await db.one(
                'INSERT INTO usua_usuario (usua_email, usua_senha, usua_tipo_usuario) VALUES ($1, $2, $3) RETURNING usua_email as email, usua_tipo_usuario as tipo',
                [email, senhaCriptografada, tipo]
            );

            return novoUsuario;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Erro ao criar usuário: ${error}`);
        }
    }

    /**
     * Atualiza apenas a senha do usuário (única coisa que o usuário pode alterar)
     */
    public async updateSenhaUsuario(email: string, novaSenha: string): Promise<void> {
        try {
            const usuarioExistente = await this.getUsuarioByEmail(email);
            if (!usuarioExistente) {
                throw new Error('Usuário não encontrado');
            }

            // Criptografa a nova senha
            const senhaCriptografada = crypto.createHash('sha256').update(novaSenha).digest('hex');

            await db.none(
                'UPDATE usua_usuario SET usua_senha = $1 WHERE usua_email = $2',
                [senhaCriptografada, email]
            );
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Erro ao atualizar senha: ${error}`);
        }
    }

    /**
     * Remove um usuário do sistema
     */
    public async deleteUsuario(email: string): Promise<void> {
        try {
            const usuarioExistente = await this.getUsuarioByEmail(email);
            if (!usuarioExistente) {
                throw new Error('Usuário não encontrado');
            }

            await db.none('DELETE FROM usua_usuario WHERE usua_email = $1', [email]);

            // Remove todos os tokens ativos do usuário
            this.revokeAllUserTokens(email);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Erro ao deletar usuário: ${error}`);
        }
    }

    /**
     * Valida as credenciais de login e gera um token
     */
    public async login(email: string, senha: string): Promise<{ usuario: Omit<Usuario, 'senha'>, token: string } | null> {
        try {
            const senhaCriptografada = crypto.createHash('sha256').update(senha).digest('hex');
            const usuario = await db.oneOrNone(
                'SELECT usua_email as email, usua_tipo_usuario as tipo FROM usua_usuario WHERE usua_email = $1 AND usua_senha = $2',
                [email, senhaCriptografada]
            );

            if (!usuario) {
                return null;
            }

            // Gera um token único para a sessão
            const token = this.generateToken(email, usuario.tipo);

            return {
                usuario,
                token
            };
        } catch (error) {
            throw new Error(`Erro ao validar credenciais: ${error}`);
        }
    }

    /**
     * Gera um token de sessão único
     */
    private generateToken(email: string, tipo: number): string {
        const timestamp = Date.now().toString();
        const randomBytes = crypto.randomBytes(16).toString('hex');
        const tokenData = `${email}:${timestamp}:${randomBytes}`;
        const token = crypto.createHash('sha256').update(tokenData).digest('hex');

        // Armazena o token com expiração de 24 horas
        const expiraEm = new Date(Date.now() + 24 * 60 * 60 * 1000);
        tokensAtivos.set(token, {
            token,
            email,
            tipo,
            expiraEm
        });

        return token;
    }

    /**
     * Valida um token de sessão
     */
    public validateToken(token: string): { valid: boolean; email?: string; tipo?: number } {
        const tokenSessao = tokensAtivos.get(token);

        if (!tokenSessao) {
            return { valid: false };
        }

        // Verifica se o token expirou
        if (new Date() > tokenSessao.expiraEm) {
            tokensAtivos.delete(token);
            return { valid: false };
        }

        return {
            valid: true,
            email: tokenSessao.email,
            tipo: tokenSessao.tipo
        };
    }

    /**
     * Remove um token específico (logout)
     */
    public revokeToken(token: string): void {
        tokensAtivos.delete(token);
    }

    /**
     * Remove todos os tokens de um usuário
     */
    public revokeAllUserTokens(email: string): void {
        for (const [token, tokenSessao] of tokensAtivos.entries()) {
            if (tokenSessao.email === email) {
                tokensAtivos.delete(token);
            }
        }
    }

    /**
     * Limpa tokens expirados (método de limpeza)
     */
    public cleanExpiredTokens(): void {
        const agora = new Date();
        for (const [token, tokenSessao] of tokensAtivos.entries()) {
            if (agora > tokenSessao.expiraEm) {
                tokensAtivos.delete(token);
            }
        }
    }

    /**
     * Busca usuários baseado no tipo do usuário logado
     * - Tipo 1 (admin): retorna todos os usuários
     * - Tipo 2 (comum): retorna apenas o próprio usuário
     */
    public async getUsuariosFiltrados(emailUsuarioLogado: string, tipoUsuarioLogado: number): Promise<Usuario[]> {
        try {
            if (tipoUsuarioLogado === 1) {
                // Administrador pode ver todos os usuários
                return await this.getUsuarios();
            } else {
                // Usuário comum só pode ver a si mesmo
                const usuario = await this.getUsuarioByEmail(emailUsuarioLogado);
                if (usuario) {
                    // Remove a senha por segurança
                    const { senha: _, ...usuarioSemSenha } = usuario;
                    return [usuarioSemSenha as Usuario];
                }
                return [];
            }
        } catch (error) {
            throw new Error(`Erro ao buscar usuários filtrados: ${error}`);
        }
    }
}

