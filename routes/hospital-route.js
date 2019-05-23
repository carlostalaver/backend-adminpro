var express = require("express");
var app = express();

var HospitalSchema = require("../models/hospital-model");

var mdAutenticacion = require('../middlewares/autenticacion')


// Obtener todos los Hospitales
app.get("/",  (req, res, next) => {

  var inicio = req.query.inicio || 0;
  inicio = Number(inicio);

  HospitalSchema.find({})
  .skip(inicio) // para que retorne desde el valor indicado
  .limit(5) // retornara de 5 en 5
  .populate('usuario', 'nombre email')
  .exec((err, hospitales) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando los hospitales desde la BBDD",
        errors: err
      });
    } 

    HospitalSchema.count('', (err, conteo)=>{
      res.status(200).json({
        ok: true,
        hospitales: hospitales,
        totalRegistros: conteo
      });
    })
  });
});

// Actualizar Hospital
app.put('/:id', mdAutenticacion.verificarToken,  (req, res ) => { 
  var id = req.params['id'];
  var body = req.body;
 
  HospitalSchema.findById(id,  (err, hospital) => {
   if( err){
     return res.status(500).json({
       ok: false,
       mensaje: "Error al mostrar hospital",
       errors: err
     });
   }
 
   if (!hospital) {
     return res.status(400).json({
       ok: false,
       mensaje: ` El hospital con id ${id} no exist`,
       errors: {message:'No existe un hospital con el id indicado'}
     });
   }
 
   hospital.nombre = body.nombre;
   hospital.usuario =req.usuario._id;
   
   hospital.save((err, hospitalActualizado) => {
     if( err){
       return res.status(400).json({
         ok: false,
         mensaje: "Error al actualizar hospital",
         errors: err
       });
     }
 
     res.status(200).json({
       ok: true,
       hospital: hospitalActualizado
     })
   })
  });
 });

 // crear un nuevo hospital
app.post('/', mdAutenticacion.verificarToken, (req, res, next) => {

  var body = req.body; // hago uso de la prop body solo poque estoy usuando bodyparser

  var hospitalActual = new HospitalSchema({
    nombre: body.nombre,
    usuario: req.usuario._id
  });

  hospitalActual.save((err, hospitalNuevo ) => {
    if (err) {
     return res.status(400).json({
        ok: false,
        mensaje :'Error al crear el Hospital',
        error: err
      });
    }
    
    res.status(201).json({
      ok: true,
      hospital: hospitalNuevo,
    });
    
  })

})

// Eliminar un Hospital
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
  var id = req.params['id'];
  HospitalSchema.findByIdAndRemove(id, (err, hospitalEliminado) => {
    if( err){
      return res.status(400).json({
        ok: false,
        mensaje: "Error al eliminar hospital",
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalEliminado
    })
  });
})


module.exports = app;
