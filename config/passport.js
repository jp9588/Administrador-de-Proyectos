const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

//referenciar le modelo
const Usuarios = require('../model/Usuarios');

//local strategy - Login con parametros propios

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			try {
				const usuario = await Usuarios.findOne({
					where: { email: email }
				});
				if (!usuario.checkPassword(password)) {
					return done(null, false, {
						message: 'Password Incorrecto'
					});
				}
				//email y password correcto!!
				return done(null, usuario);
			} catch (error) {
				return done(null, false, {
					message: 'Esa cuenta no existe'
				});
			}
		}
	)
);

//serializar usuario

passport.serializeUser((usuario, callback) => {
	callback(null, usuario);
});

//deserializar usuario
passport.deserializeUser((usuario, callback) => {
	callback(null, usuario);
});

module.exports = passport;
