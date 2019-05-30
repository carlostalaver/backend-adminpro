var express = require("express");
var app = express();
var UsuarioSchema = require("../models/usuario");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require('../config/config').SEED;

// para la utenticacion por google
const {OAuth2Client} = require('google-auth-library');
var CLIENT_ID = require('../config/config').CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({idToken: token, audience: CLIENT_ID });
  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
    payload
  }
}


// Autenticacion con/por google
app.post('/google', async (req, res) => {

  const token = req.body.token;

  console.log(`los datos recibidos token ${token}`);
  
  const googleUser = await verify(token)
          .catch(err => {
            return res.status(403).json({
              ok: false,
              mensaje: 'Token no valido',
              errors: {message: err}
            });
          });
  
   UsuarioSchema.findOne({email: googleUser.email}, (err, usuarioBD) => {

    
      if( err) {
        return res.status(500).json({
          ok: true,
          message: `no se encontro en BBDD un usuarion con el email ${googleUser.email}`
        })
      }
      if(usuarioBD) {
        if (usuarioBD.google === false) {
          return res.status(400).json({
            ok: false,
            message: `Debe usar autenticación normal`
          });

        } else  {
          var token = jwt.sign({ usuario: usuarioBD }, SEED, {expiresIn: 14400});
      
          res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
          });
        }
    } else {
      let usuarioNew = new UsuarioSchema({
        nombre: googleUser.nombre,
        email: googleUser.email,
        img: googleUser.img,
        google: true,
        password: ':)',
      });
      
      usuarioNew.save((err, usuarioAlmacenado) => {
        
        if(err){
          return res.status(500).json({
            ok: false,
            errors: 'Ocurrio un error al guardar el usuarioSchema',
            err: {message: err}
          });
        }

        var token = jwt.sign({ usuario: usuarioBD }, SEED, {expiresIn: 14400});
          res.status(200).json({
            ok: true,
            usuario: usuarioAlmacenado,
            token: token,
          });
      });
    }
   });
}) 


// autenticacion NORMAL
app.post("/", (req, res) => {
  var body = req.body;
  console.log(' --->  los datos que llegan del front', body);
  
  UsuarioSchema.findOne({ email: body.email }, (err, usuarioBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
      });
    }

    if (!usuarioBD) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas -- email",
        errors: err
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioBD.password))
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas -- Password",
        errors: err
      });

    // Generar  token
    usuarioBD.password = ":)";
    var token = jwt.sign({ usuario: usuarioBD }, SEED, {
      expiresIn: 14400
    });

    res.status(200).json({
      ok: true,
      usuario: usuarioBD,
      token: token,
      id: usuarioBD._id
    });
  });
});


module.exports = app;
