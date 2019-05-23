// Requires
var express = require('express');
var mongoose =require('mongoose');
var bodyParser = require("body-parser");


// Inicializar variables
var app = express();

//#region configurando el body-parser
  // parse application/x-www-form-urlencoded 
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json()) // parse application/json
//#endregion


// Conexion a la BBDD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
 if (err) throw err;
 console.log('Base de datos : \x1b[32m%s\x1b[0m', 'online');
});

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login')


// Middleware
app.use('/usuario', usuarioRoutes); 
app.use('/login', loginRoutes)
app.use('/', appRoutes);  

// escuchar peticiones
app.listen(3000, () => {
  console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})