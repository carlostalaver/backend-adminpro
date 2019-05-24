var  express = require('express');
var app = express();
const fileUpload = require('express-fileupload');

const UsuarioSchema = require('../models/usuario');
const MedicoSchema =  require('../models/medico-model');
const HospitalSchema = require('../models/hospital-model')

const fs = require('fs');

// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {
  const tipo = req.params.tipo;
  const id = req.params.id;
console.log(`los datos que llegan tipo ${tipo} id ${id} `);

  if (!req.files) {
    res.status(400).json({
      ok: false,
      mensaje: 'No selecciono ningun archivo',
      errors: {message: 'debe seleccionar una imagen'}
    })
  }

  // 1- Obtengo el nombre de la imagen
  const archivo = req.files.imagen;
  const nombreCortado = archivo.name.split('.');
  const extensionArchivo = nombreCortado[(nombreCortado.length-1)];

  //2- Extensiones aceptadas
  const extensionesValidas= ['png', 'jpg', 'gif', 'jpeg', 'PNG'];

  if(extensionesValidas.indexOf(extensionArchivo) < 0){
    res.status(400).json({
      ok: false,
      mensaje: 'la extesion del archivo no es valida',
      errors: {message: 'Las extensiones validad son ' + extensionesValidas.join(' ')}
    })
  } 

  //2.1 tipos de colecciones aceptadas  
  const tiposColAceptadas = ['hospitales', 'medicos', 'usuarios']
    if( tiposColAceptadas.indexOf(tipo) < 0) {
      res.status(400).json({
        ok: false,
        mensaje: 'Nombre de la coleccion no valido',
        errors: {message: 'Los nombres validos para las colecciones son ' + tiposColAceptadas.join(' ')}
      })
    }

  //3-  Creo un nombre de archivo personalizado de la siguiente forma
  // id-numeroRamdon.extension
  const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
  
  //4-  Muevo el archivo del temporal a un path
    const path = `./uploads/${tipo}/${nombreArchivo}`
    archivo.mv(path, (err, succsess)=> {
      if (err) {
        res.status(500).json({
          ok: false,
          mensaje: 'No se puedo mover el archivo',
          errors: {message: 'Ocurrio un error al mover el archivo'}
        })
      }
      subirPorTipo(tipo, id, nombreArchivo, res)
    })
})

function subirPorTipo(tipo, id, nombreArchivo, res){
  if( tipo === 'usuarios'){
    UsuarioSchema.findById(id, (err, usuario) => {
      // ToDo manejar el error 
      if (!usuario) {
        return res.status(400).json({
          ok: false,
          message: 'Usuario no existe',
          errors: {message:'Usuario no existe !!!'}  
        })
      }

       var pathViejo = './uploads/usuarios/'+usuario.img;

       // si existe, eliminar la imagen anterior

       if(fs.existsSync(pathViejo)){
         
         fs.unlink(pathViejo, (err) => {
           if(err){
             console.log('ha ocurrido un error al eliminar el archivo');
              }
         });
       }

       usuario.img = nombreArchivo;

        usuario.save((err, usuarioActualizado) => {
         // ToDo manejar el erro 

        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de usuario actualizada!!',
          usuario: usuarioActualizado
        })  

       })

    })

  }// end if usuarios

  if( tipo === 'hospitales'){
    HospitalSchema.findById(id, (err, hospital) => {
      // ToDo manejar el error 
      if (!hospital) {
        return res.status(400).json({
          ok: false,
          message: 'Hospital no existe',
          errors: {message:'Hospital no existe !!!'}  
        })
      }
       var pathViejo = './uploads/hospitales/'+hospital.img;

       // si existe, eliminar la imagen anterior

       if(fs.existsSync(pathViejo)){
         
         fs.unlink(pathViejo, (err) => {
           if(err){
             console.log('ha ocurrido un error al eliminar el archivo');
              }
         });
       }

       hospital.img = nombreArchivo;

        hospital.save((err, hospitalActualizado) => {
         // ToDo manejar el erro 

        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de hospital actualizada!!',
          hospital: hospitalActualizado
        })  

       })

    })

  }// end if hospitales

  if( tipo === 'medicos'){
    MedicoSchema.findById(id, (err, medico) => {
      // ToDo manejar el error 
      if (!medico) {
        return res.status(400).json({
          ok: false,
          message: 'medico no existe',
          errors: {message:'medico no existe !!!'}  
        })
      }
       var pathViejo = './uploads/medicos/'+medico.img;

       // si existe, eliminar la imagen anterior

       if(fs.existsSync(pathViejo)){
         
         fs.unlink(pathViejo, (err) => {
           if(err){
             console.log('ha ocurrido un error al eliminar el archivo');
              }
         });
       }

       medico.img = nombreArchivo;

        medico.save((err, medicoActualizado) => {
         // ToDo manejar el erro 

        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de medico actualizada!!',
          medico: medicoActualizado
        })  

       })

    })

  }// end if medicos

}// end funcion subirPorTipo
module.exports = app;
