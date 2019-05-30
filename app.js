// Requires
var express = require('express');
var mongoose =require('mongoose');
var bodyParser = require("body-parser");



// Inicializar variables
var app = express();


// Habilar los CORS en este servidor
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // habilito las peticiones que deseo aceptar en el server
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});


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
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital-route');
var medicoRoutes = require('./routes/medico-route');
var busquedaGeneralRoutes = require('./routes/busqueda-general-route');
var uploadFile = require('./routes/upload-route');
const imagenRoute = require('./routes/imagen-route');


// Middleware
app.use('/usuario', usuarioRoutes); 
app.use('/hospital', hospitalRoutes); 
app.use('/busqueda', busquedaGeneralRoutes); 
app.use('/upload', uploadFile);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/img', imagenRoute);
app.use('/', appRoutes); 

// Server index context

// escuchar peticiones
app.listen(3000, () => {
  console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})