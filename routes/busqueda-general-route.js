var  express = require('express');
var app = express();
var HospitalSchema =  require('../models/hospital-model');
var MedicoSchema = require('../models/medico-model')
var UsuarioSchema = require('../models/usuario')


//busqueda especifica
app.get("/coleccion/:tabla/:busqueda", (req, res, next) => {
   var tabla = req.params.tabla;
   var busqueda = req.params.busqueda;
   var regex = new RegExp(busqueda, "i");
   var promesa = null;

  switch (tabla) {
    case "usuarios":
      promesa = burcarUsuarios(busqueda, regex);
      break;
    case "hospitales":
      promesa = burcarHospitales(busqueda, regex);
      break;
    case "medicos":
      promesa = burcarMedicos(busqueda, regex);
      break;
    default:
     return res.status(404).json({
       ok: false,
       message: 'Los tipos de busqueda solo son, usuarios, medicos y hospitales',
       error: {message: 'Tipo de tabla/coleccion no valida'}
     })
  }

  promesa.then((data) => {
     res.status(200).json({
      ok: true,
      [tabla]: data
    })
  })
    
})

// Busqueda generica
app.get("/todo/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i"); // i para que sea insensible a minusculas y mayusculas

  Promise.all([burcarHospitales(busqueda, regex), burcarMedicos(busqueda, regex), burcarUsuarios(busqueda, regex)])
    .then( resultados => {
      res.status(200).json({
        ok: true,
        hospitales: resultados[0],
        medicos: resultados[1],
        usuarios: resultados[2],
      });
    })
}); 

// retorna una promesa con los hospitales
function burcarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {
    HospitalSchema.find({ nombre: regex })
      .populate("usuario", "nombre email img")
      .exec((err, hospitales) => {
        if (err) {
          reject("Error al cargar hospitales", err);
        } else {
          resolve(hospitales);
        }
      });
  });
}
// retorna una promesa con los medicos
function burcarMedicos(busqueda, regex) {
  return new Promise((resolve, reject) => {
    MedicoSchema.find({ nombre: regex })
      .populate("usuario", " nombre email img")
      .populate("hospital", "nombre")
      .exec((err, medicos) => {
        if (err) {
          reject("Error al cargar medicos", err);
        } else {
          resolve(medicos);
        }
      });
  });
}

// retorna una promesa con los usuarios
function burcarUsuarios(busqueda, regex) {
  return new Promise((resolve, reject) => {
    UsuarioSchema.find({}, "nombre email role img")
      .or([{ nombre: regex }, { email: regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject("Ocurrio un error al cargar los usuarios ", err);
        } else {
          resolve(usuarios);
        }
      });
  });
}
module.exports = app;
