var express = require("express");
var app = express();
var UsuarioSchema = require("../models/usuario");
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
var SEED = require('../config/config').SEED;

var mdAutenticacion = require('../middlewares/autenticacion')


// Obtener todos los usuarios
app.get("/", (req, res, next) => {

  var inicio = req.query.inicio || 0;
  inicio = Number(inicio);

  UsuarioSchema.find({}, "nombre email img role google")
  .skip(inicio) // para que retorne desde el valor indicado
  .limit(5) // retornara de 5 en 5
  .exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando usuarios desde la BBDD",
        errors: err
      });
    } 

    UsuarioSchema.count('', (err, conteo) => {
      res.status(200).json({
        ok: true,
        usuarios: usuarios,
        totalRegistros: conteo
      });

    })
  });
});


// Actualizar usuario
app.put('/:id', mdAutenticacion.verificarToken, (req, res ) => { 
  var id = req.params['id'];
  var body = req.body;
 
  UsuarioSchema.findById(id,  (err, usuario) => {
   if( err){
     return res.status(500).json({
       ok: false,
       mensaje: "Error al mostrar usuario",
       errors: err
     });
   }
 
   if (!usuario) {
     return res.status(400).json({
       ok: false,
       mensaje: ` El usuario con id ${id} no exist`,
       errors: {message:'No existe un usuario con el id indicado'}
     });
   }
 
   usuario.nombre = body.nombre;
   usuario.email = body.email;
   usuario.role = body.role;
 
   usuario.save((err, usuarioActualizado) => {
     if( err){
       return res.status(400).json({
         ok: false,
         mensaje: "Error al actualizar usuario",
         errors: err
       });
     }
 
     res.status(200).json({
       ok: true,
       usuario: usuarioActualizado
     })
   })
  });
 });

// crear un nuevo usuario
app.post('/', /* mdAutenticacion.verificarToken, */ (req, res, next) => {

  var body = req.body; // hago uso de la prop body solo poque estoy usuando bodyparser

  var usuarioActual = new UsuarioSchema({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuarioActual.save((err, usuarioNew ) => {
    if (err) {
     return res.status(400).json({
        ok: false,
        mensaje :'Error al crear el usuario',
        error: err
      });
    }
    
    res.status(201).json({
      ok: true,
      usuario: usuarioNew,
      usuarioToken: req.usuario
    });
    
  })

})

// Eliminar un usuario
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
  var id = req.params['id'];
  UsuarioSchema.findByIdAndRemove(id, (err, usuarioEliminado) => {
    if( err){
      return res.status(400).json({
        ok: false,
        mensaje: "Error al eliminar usuario",
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      usuario: usuarioEliminado
    })
  });
})
module.exports = app;
