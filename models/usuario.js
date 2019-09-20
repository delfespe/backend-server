var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}
var usuarioSchema = new Schema({
    nombre : {type: String, required: [true, 'necesario']},
    email : {type: String, unique: true, required: [true, 'necesario']},
    password : {type: String, required: [true, 'necesario']},
    imagen : {type: String, required: false},
    role : {type: String, required: false, default: 'USER_ROLE', enum: rolesValidos}
});

usuarioSchema.plugin(uniqueValidator, {message:'El {PATH} debe ser unico'});

module.exports = mongoose.model('Usuario', usuarioSchema);