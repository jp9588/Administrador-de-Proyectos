const Proyectos = require('../model/Proyectos');
const Tareas = require('../model/Tareas');
const Usuarios = require('../model/Usuarios');

exports.proyectosHome = async (req, res) => {
	const dataUsuarioSession = req.user;
	// console.log(dataUsuarioSession);
	const { id, email } = dataUsuarioSession;
	const proyectos = await Proyectos.findAll({ where: { usuarioId: id } });
	//console.log(proyectos);
	res.render('index', {
		listaProyectos: proyectos,
		nombreUsuario: email
	});
};

exports.crearNuevoProyecto = async (req, res) => {
	const dataUsuarioSession = req.user;

	const { id } = dataUsuarioSession;
	const proyectos = await Proyectos.findAll({ where: { usuarioId: id } });

	res.render('formulario-nuevoProyecto', {
		nombrePagina: 'Nuevo Proyecto',
		listaProyectos: proyectos
	});
};

exports.nuevoProyecto = async (req, res) => {
	const dataUsuarioSession = req.user;

	const { id } = dataUsuarioSession;
	const proyectos = await Proyectos.findAll({ where: { usuarioId: id } });

	const { nombre } = req.body;

	let errores = [];
	//console.log(nombre);

	if (!nombre) {
		errores.push({ texto: 'Agrega un nombre al proyecto!!!' });
	}

	if (errores.length > 0) {
		res.render('formulario-nuevoProyecto', {
			nombrePagina: 'Nuevo Proyecto',
			errores,
			listaProyectos: proyectos
		});
	} else {
		const proyecto = await Proyectos.create({ nombre, usuarioId: id });
		res.redirect('/');
	}
};

exports.muestraProyectoByUrl = async (req, res, next) => {
	const dataUsuarioSession = req.user;

	const { id } = dataUsuarioSession;
	const proyectos = await Proyectos.findAll({ where: { usuarioId: id } });

	const proyecto = await Proyectos.findOne({
		where: {
			url: req.params.url
		}
	});

	if (!proyecto) return next();

	//console.log(proyecto);
	const tareas = await Tareas.findAll({
		where: {
			proyectoId: proyecto.id
		}
	});

	// console.log(tareas);
	const { count } = await Tareas.findAndCountAll({ where: { proyectoId: proyecto.id, estado: 1 } });
	//console.log(count);

	res.render('tareas', {
		nombrePagina: 'Tareas del Proyecto',
		proyecto,
		listaProyectos: proyectos,
		tareas,
		count
	});
};

exports.editarProyectos = async (req, res) => {
	const dataUsuarioSession = req.user;

	const { id } = dataUsuarioSession;
	const proyectos = await Proyectos.findAll({ where: { usuarioId: id } });

	const proyecto = await Proyectos.findOne({
		where: {
			id: req.params.id
		}
	});

	res.render('formulario-nuevoProyecto', {
		nombrePagina: 'Editar el Proyecto',
		proyecto,
		listaProyectos: proyectos
	});
};

exports.actualizarProyecto = async (req, res) => {
	const dataUsuarioSession = req.user;

	const { id } = dataUsuarioSession;
	const proyectos = await Proyectos.findAll({ where: { usuarioId: id } });

	const { nombre } = req.body;

	let errores = [];
	//console.log(nombre);

	if (!nombre) {
		errores.push({ texto: 'Agrega un nombre al proyecto!!!' });
	}

	if (errores.length > 0) {
		res.render('formulario-nuevoProyecto', {
			nombrePagina: 'Nuevo Proyecto',
			errores,
			listaProyectos: proyectos
		});
	} else {
		await Proyectos.update({ nombre: nombre }, { where: { id: req.params.id } });
		res.redirect('/');
	}
};

exports.eliminarProyecto = async (req, res) => {
	await Proyectos.destroy({
		where: {
			id: req.params.id
		}
	});

	const dataUsuarioSession = req.user;

	const { id } = dataUsuarioSession;
	const proyectos = await Proyectos.findAll({ where: { usuarioId: id } });

	res.render('index', {
		listaProyectos: proyectos
	});
};
