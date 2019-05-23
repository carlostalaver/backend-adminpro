var  express = require('express');
var app = express();
const fileUpload = require('express-fileupload');

const UsuarioSchema = require('../models/usuario');
const MedicoSchema =  require('../models/medico-model');
const HospitalSchema = require('../models/hospital-model')

const fs = require('fs');

// default options
app.use(fileUpload());


app.put('/:tipo/:idUsuario', (req, res, next) => {
  const tipo = req.params.tipo;
  const idUsuario = req.params.idUsuario;

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
  // idUsuario-numeroRamdon.extension
  const nombreArchivo = `${idUsuario}-${new Date().getMilliseconds()}.${extensionArchivo}`;
  
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
      subirPorTipo(tipo, idUsuario, nombreArchivo, res)
/*      */
    })
})

function subirPorTipo(tipo, idUsuario, nombreArchivo, res){
  if( tipo === 'usuarios'){
    UsuarioSchema.findById(idUsuario, (err, usuario) => {
      // ToDo manejar el error 

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

  }// end if
}// end funcion subirPorTipo
module.exports = app;
