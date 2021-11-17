const Sequelize = require('sequelize');

const bcrypt = require('bcrypt-nodejs');

const db = require('../config/db');
const Proyectos = require('./Proyectos');

const Usuarios = db.define(
	'usuarios',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				isEmail: {
					msg: 'Ingresa una direccion de correo valida'
				},

				notEmpty: {
					msg: 'El Email no puede ir vacio!'
				}
			},
			unique: {
				args: true,
				msg: ' El usuario ya ha sido Registrado'
			}
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: 'El Email no puede ir vacio!'
				}
			}
		},
		token: Sequelize.STRING,
		expire: Sequelize.DATE
	},
	{
		hooks: {
			beforeCreate(usuario) {
				usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
			}
		}
	}
);
Usuarios.prototype.checkPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
