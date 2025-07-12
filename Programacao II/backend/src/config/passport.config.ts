import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { UsuarioService } from '../service/usuario.service';

const usuarioService = new UsuarioService();

// Configuração do JWT

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT_SECRET precisa ser definido nas variáveis de ambiente');
}

const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
    algorithms: ['HS256']
};

// JWT
passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            // Busca o usuário no banco de dados usando o email do payload
            const usuario = await usuarioService.getUsuarioByEmail(jwtPayload.email);

            if (usuario) {
                // Remove a senha do objeto retornado
                const { senha, ...usuarioSemSenha } = usuario;
                return done(null, usuarioSemSenha);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

// Exporta a instância configurada do passport
export = passport;
