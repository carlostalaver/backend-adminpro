var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator'); 

var Schema  = mongoose.Schema;

// Para controlar los roles de usuario que la app permitirá, restringe a los roles que yo desee
var rolesPermitidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE}  no es un rol permitido'
}

/* al schema hay que pasarle un obj con la configuracion del registro que se desea manipular   SchemaTypeOpts<T>*/ 
var usuarioSchema = new Schema({
  nombre: {type: String, required: [true, 'El usuario es requerido']},
  email: {type: String, unique: true, required: [true, 'El correo es requerido']},
  password: {type: String, required: [true, 'El password es requerido']},
  img: {type: String, required: false},
  role: {type: String, required: true, default: 'USER_ROLE', enum: rolesPermitidos}
}); 

// configuro el msj de validacion para campos unícos
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser uníco'})



module.exports = mongoose.model('Usuario', usuarioSchema);