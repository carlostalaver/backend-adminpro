var express = require("express");
var app = express();

var MedicoSchema = require("../models/medico-model");

var mdAutenticacion = require('../middlewares/autenticacion')

// Obtener todos los medicos
app.get("/",  (req, res, next) => {

  var inicio = req.query.inicio || 0;
  inicio = Number(inicio);

  MedicoSchema.find({})
  .skip(inicio) // para que retorne desde el valor indicado
  .limit(5) // retornara de 5 en 5
  .populate('usuario', 'nombre email')
  .populate('hospital')
  .exec((err, medicos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando los medicos desde la BBDD",
        errors: err
      });
    } 

    MedicoSchema.count('', (err, conteo)=>{
      res.status(200).json({
        ok: true,
        medicos: medicos,
        totalRegistros: conteo
      });
    })
  });
});

// Actualizar Hospital
app.put('/:id', mdAutenticacion.verificarToken,  (req, res ) => { 
  var id = req.params['id'];
  var body = req.body;
 
  MedicoSchema.findById(id,  (err, medico) => {
   if( err){
     return res.status(500).json({
       ok: false,
       mensaje: "Error al mostrar medico",
       errors: err
     });
   }
 
   if (!medico) {
     return res.status(400).json({
       ok: false,
       mensaje: ` El medico con id ${id} no exist`,
       errors: {message:'No existe un medico con el id indicado'}
     });
   }
 
   medico.nombre = body.nombre;
   medico.usuario =req.usuario._id;
   medico.hospital =body.hospital;
   
   medico.save((err, medicoActualizado) => {
     if( err){
       return res.status(400).json({
         ok: false,
         mensaje: "Error al actualizar medico",
         errors: err
       });
     }
 
     res.status(200).json({
       ok: true,
       medico: medicoActualizado
     })
   })
  });
 });

// crear un nuevo medico
app.post('/', mdAutenticacion.verificarToken, (req, res, next) => {

  var body = req.body; // hago uso de la prop body solo poque estoy usuando bodyparser

  var medicoActual = new MedicoSchema({
    nombre: body.nombre,
    usuario: req.usuario._id,
    hospital: body.hospital
  });

  medicoActual.save((err, medicoNuevo ) => {
    if (err) {
     return res.status(400).json({
        ok: false,
        mensaje :'Error al crear el Medico',
        error: err
      });
    }
    
    res.status(201).json({
      ok: true,
      hospital: medicoNuevo,
    });
    
  })

})

// Eliminar un medico
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
  var id = req.params['id'];
  MedicoSchema.findByIdAndRemove(id, (err, medicoEliminado) => {
    if( err){
      return res.status(400).json({
        ok: false,
        mensaje: "Error al eliminar medico",
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      medico: medicoEliminado
    })
  });
})


module.exports = app;
