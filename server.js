const express = require('express');
require('dotenv').config({ path: 'variables.env' });

const routes = require('./routes');

const path = require('path');

const bodyParser = require('body-parser');

const flash = require('connect-flash');

const db = require('./config/db');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const passport = require('./config/passport');

require('./model/Proyectos');
require('./model/Tareas');
require('./model/Usuarios');

// db
// 	.authenticate()
// 	.then(() => console.log('Conectado Correctamente al servidor MySql'))
// 	.catch((error) => console.log('Algo ocurrio al conectarse al servidor ' + error));
db
	.sync()
	.then(() => console.log('Conexion establecida a MySql'))
	.catch((error) => console.log('Algo salio mal con la conexion syn ' + error));
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, './views'));

app.use(flash());

app.use(cookieParser());

app.use(
	session({
		secret: 'Es un secreto',
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
	console.log(`SERVER RUNNING ...Press Ctrl + C to stop the server!!`);
});
