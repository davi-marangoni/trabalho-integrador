import { Usuario } from '../interface/usuario';
import db from '../db/database';
import bcrypt from 'bcryptjs';

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
     * Verifica se o email já existe e criptografa a senha com bcrypt
     */
    public async createUsuario(dadosUsuario: Usuario): Promise<Omit<Usuario, 'senha'>> {
        try {
            const { email, senha, tipo } = dadosUsuario;

            // Verifica se o email já existe
            const usuarioExistente = await this.getUsuarioByEmail(email);
            if (usuarioExistente) {
                throw new Error('Email já cadastrado no sistema');
            }

            // Criptografa a senha com bcrypt
            const saltRounds = 12;
            const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

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

            // Criptografa a nova senha com bcrypt
            const saltRounds = 12;
            const senhaCriptografada = await bcrypt.hash(novaSenha, saltRounds);

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
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Erro ao deletar usuário: ${error}`);
        }
    }
}

