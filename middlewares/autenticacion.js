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
