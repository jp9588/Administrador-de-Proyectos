const Tareas = require('../model/Tareas');
const Proyectos = require('../model/Proyectos');

exports.crearTarea = async (req, res) => {
	const proyectos = await Proyectos.findAll();
	const proyecto = await Proyectos.findOne({
		where: {
			url: req.params.url
		}
	});

	const { tarea } = req.body;

	let errores = [];
	//console.log(nombre);
	const estado = 0;

	if (!tarea) {
		errores.push({ texto: 'Agrega un nombre a la tarea!!!' });
	}
	// } else {
	// 	await Tareas.create({ tarea, estado, proyectoId: proyecto.id });
	// 	res.redirect(`/proyectos/${req.params.url}`);
	// }

	//----------------------
	if (errores.length > 0) {
		const tareas = await Tareas.findAll({ where: { proyectoId: proyecto.id } });
		res.render('tareas', {
			nombrePagina: 'Tareas del proyecto',
			errores,
			listaProyectos: proyectos,
			tareas,
			proyecto
		});
	} else {
		await Tareas.create({ tarea, estado, proyectoId: proyecto.id });
		res.redirect(`/proyectos/${req.params.url}`);
	}
};

exports.checkTareaCompleta = async (req, res) => {
	const tareaCurrent = await Tareas.findOne({ where: { id: req.params.id } });

	let nuevoEstado;

	if (tareaCurrent.dataValues.estado === 1) {
		nuevoEstado = 0;
	} else {
		nuevoEstado = 1;
	}

	await Tareas.update(
		{
			estado: nuevoEstado
		},
		{
			where: {
				id: req.params.id
			}
		}
	);

	const idCurrentProyect = tareaCurrent.dataValues.proyectoId;

	const proyecto = await Proyectos.findOne({ where: { id: idCurrentProyect } });

	res.redirect(`/proyectos/${proyecto.dataValues.url}`);
};

exports.eliminarTarea = async (req, res) => {
	const tareaCurrent = await Tareas.findOne({ where: { id: req.params.id } });

	const idCurrentProyect = tareaCurrent.dataValues.proyectoId;

	await Tareas.destroy({
		where: {
			id: req.params.id
		}
	});

	const proyecto = await Proyectos.findOne({ where: { id: idCurrentProyect } });

	res.redirect(`/proyectos/${proyecto.dataValues.url}`);
};

exports.cuantasTareasActivas = async (idCurrent) => {
	const { count } = await Tareas.findAndCountAll({ where: { proyectoId: idCurrent, estado: 1 } });

	return count;
};
