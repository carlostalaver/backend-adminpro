var  express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {

  const tipo = req.params.tipo;
  const img = req.params.img;
  
  const pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
  
  if(fs.existsSync(pathImagen)){
    res.sendFile(pathImagen) // renderiza la imagen si existe
  } else {
    var pathNotImagen = path.resolve(__dirname, '../assets/no-img.jpg');
    res.sendFile(pathNotImagen);
  }
})


module.exports = app;
