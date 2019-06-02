var jwt = require("jsonwebtoken");
var SEED = require('../config/config').SEED;

//#region middfleware que valida el token, notar que retorno void, por lo tanto si no
// llamo a next() NO SE EJECUTARÁ el siguiente middleware

    module.exports.verificarToken = function(req, res, next){

      var token = req.query.token;
      jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            ok: false,
            mensaje: `Token no valido`,
            errors: err
          });
        }
        req.usuario = decoded.usuario
        next();
      });
    }
//#endregion

//#region Verifica ADMIN_ROLE
module.exports.verificarADMIN_ROLE_o_MismoUsuario = function(req, res, next){

  const usuario = req.usuario;
  const id = req.params.id;

  if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
      next()
      return;
  } else {
    return res.status(401).json({
      ok: false,
      mensaje: `Token no valido *** No es ADMINISTRADOR o NO ES EL MISMO USUARIO ****`,
      errors: {message: 'el usuario no es un administrador, no puede realizar la accion'}
    });
  }
  
}
//#region 
