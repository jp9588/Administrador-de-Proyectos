const Usuarios = require('../model/Usuarios');

exports.crearUsuarioForm = (req, res) => {
	let errores = [ { msg: null } ];

	res.render('crear-usuario', {
		nombrePagina: 'Crea Tu Cuenta en Administrador de Proyectos',
		errores
	});
};
exports.guardarNuevoUsuario = async (req, res) => {
	const { email, password } = req.body;

	let errores = [];

	const emailExist = await Usuarios.findOne({ where: { email: email } });

	if (emailExist) {
		errores.push({ msg: 'El usuario ya  ha sido previamente registrado' });
		res.render('crear-usuario', {
			nombrePagina: 'Crea Tu Cuenta en Administrador de Proyectos',
			errores
		});
	} else {
		await Usuarios.create({ email, password });

		res.redirect('/usuario/iniciar-sesion');
	}
};

exports.iniciarSesion = (req, res) => {
	res.render('login', {
		nombrePagina: 'Inicia Sesion'
	});
};
