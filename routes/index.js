const express = require('express');

const { body } = require('express-validator');

const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuarioController = require('../controllers/usuarioController');
const authController = require('../controllers/authController');
const router = express.Router();

module.exports = function() {
	//routes para manejar los proyectos
	router.get('/', authController.isUserAuth, proyectosController.proyectosHome);
	router.get('/nuevo-proyecto', authController.isUserAuth, proyectosController.crearNuevoProyecto);
	router.post(
		'/nuevo-proyecto',
		body('nombre').not().isEmpty().trim().escape(),
		authController.isUserAuth,
		proyectosController.nuevoProyecto
	);
	router.get('/proyectos/:url', authController.isUserAuth, proyectosController.muestraProyectoByUrl);
	router.get('/proyecto/edit/:id', authController.isUserAuth, proyectosController.editarProyectos);
	router.post(
		'/nuevo-proyecto/:id',
		body('nombre').not().isEmpty().trim().escape(),
		authController.isUserAuth,
		proyectosController.actualizarProyecto
	);
	router.get('/proyecto/eliminar/:id', authController.isUserAuth, proyectosController.eliminarProyecto);
	//routes para manejar las tareas

	router.post('/proyectos/:url', authController.isUserAuth, tareasController.crearTarea);
	router.get('/tarea/check/:id', authController.isUserAuth, tareasController.checkTareaCompleta);
	router.get('/tarea/eliminar/:id', authController.isUserAuth, tareasController.eliminarTarea);

	//routes para crear usuarios

	router.get('/usuario/crear-nuevo', usuarioController.crearUsuarioForm);
	router.post('/usuario/crear-nuevo', usuarioController.guardarNuevoUsuario);

	// iniciar sesion

	router.get('/usuario/iniciar-sesion', usuarioController.iniciarSesion);
	router.post('/usuario/iniciar-sesion', authController.autenticarUsuario);
	//cerrar sesion
	router.get('/usuario/cerrar-sesion', authController.cerrarSesion);
	//resstablecer contrasenia
	router.get('/usuario/restablecer-password', authController.resetPassword);
	router.post('/usuario/restablecer-password', authController.generaToken);

	router.get('/usuario/restablecer-password/:token', authController.resetPasswordTokenSend);
	return router;
};
