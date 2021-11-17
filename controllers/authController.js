const passport = require('passport');

const Usuarios = require('../model/Usuarios');

const crypto = require('crypto');

exports.autenticarUsuario = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/usuario/iniciar-sesion'
});

exports.isUserAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}

	//si no esta autenticado

	return res.redirect('/usuario/iniciar-sesion');
};

exports.cerrarSesion = (req, res) => {
	req.session.destroy(() => {
		res.redirect('/usuario/iniciar-sesion');
	});
};

exports.resetPassword = (req, res) => {
	res.render('reset-password-form', {
		nombrePagina: 'Reestablecer tu password'
	});
};

exports.generaToken = async (req, res) => {
	const { email } = req.body;

	const usuario = await Usuarios.findOne({ where: { email } });

	if (!usuario) {
		res.render('reset-password-form', {
			nombrePagina: 'Reestablecer tu password',
			errores: { msg: 'Esta cuenta no esta registrada!' }
		});
	}
	//usuario ha sido validado
	usuario.token = crypto.randomBytes(20).toString('hex');
	usuario.expire = Date.now() + 3600000;

	await usuario.save();

	const urlReset = `http://${req.headers.host}/usuario/restablecer-password/${usuario.token}`;
};

exports.resetPasswordTokenSend = async (req, res) => {
	res.json(req.params.token);
};
