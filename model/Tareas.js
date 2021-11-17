const Sequalize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas', {
	id: {
		type: Sequalize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	tarea: Sequalize.STRING,
	estado: Sequalize.INTEGER
});

Tareas.belongsTo(Proyectos);

module.exports = Tareas;
