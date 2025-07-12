import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Usuario } from '../interface/usuario';
import { UsuarioService } from './usuario.service';

interface JwtPayload {
    email: string;
    tipo: number;
    iat?: number;
    exp?: number;
}

    let envJwtSecret = process.env.JWT_SECRET;
    let envJwtExpiresIn = process.env.JWT_EXPIRES_IN;

    if (!envJwtSecret) {
        throw new Error('JWT_SECRET precisa ser definido nas variáveis de ambiente');
    }

    if (!envJwtExpiresIn) {
        throw new Error('JWT_EXPIRES_IN precisa ser definido nas variáveis de ambiente');
    }


export class AuthService {
    private usuarioService: UsuarioService;
    private jwtSecret: string;
    private jwtExpiresIn: string | number;


    constructor() {
        this.usuarioService = new UsuarioService();
        this.jwtSecret = envJwtSecret!;
        this.jwtExpiresIn = envJwtExpiresIn!;
    }

    /**
     * Gera um hash da senha usando bcrypt
     */
    public async hashPassword(senha: string): Promise<string> {
        const saltRounds = 12;
        return await bcrypt.hash(senha, saltRounds);
    }

    /**
     * Verifica se a senha corresponde ao hash
     */
    public async verifyPassword(senha: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(senha, hash);
    }

    /**
     * Gera um token JWT
     */
    public generateToken(usuario: Pick<Usuario, 'email' | 'tipo'>): string {
        const payload: JwtPayload = {
            email: usuario.email,
            tipo: usuario.tipo
        };

        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiresIn
        } as jwt.SignOptions);
    }

    /**
     * Verifica e decodifica um token JWT
     */
    public verifyToken(token: string): JwtPayload | null {
        try {
            const decoded = jwt.verify(token, this.jwtSecret, {
                algorithms: ['HS256']
            }) as JwtPayload;

            return decoded;
        } catch (error) {
            return null;
        }
    }

    /**
     * Realiza o login do usuário
     */
    public async login(email: string, senha: string): Promise<{ usuario: Omit<Usuario, 'senha'>, token: string } | null> {
        try {
            // Busca o usuário no banco
            const usuario = await this.usuarioService.getUsuarioByEmail(email);

            if (!usuario) {
                return null;
            }

            // Verifica a senha
            const senhaValida = await this.verifyPassword(senha, usuario.senha);

            if (!senhaValida) {
                return null;
            }

            // Remove a senha do objeto de retorno
            const { senha: _, ...usuarioSemSenha } = usuario;

            // Gera o token JWT
            const token = this.generateToken(usuarioSemSenha);

            return {
                usuario: usuarioSemSenha,
                token
            };
        } catch (error) {
            throw new Error(`Erro ao realizar login: ${error}`);
        }
    }

    /**
     * Decodifica informações do token sem verificar (útil para logs)
     */
    public decodeToken(token: string): JwtPayload | null {
        try {
            return jwt.decode(token) as JwtPayload;
        } catch (error) {
            return null;
        }
    }
}
