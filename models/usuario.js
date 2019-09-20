var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre : {type: String, required: [true, 'necesario']},
    email : {type: String, unique: true, required: [true, 'necesario']},
    password : {type: String, required: [true, 'necesario']},
    imagen : {type: String, required: false},
    role : {type: String, required: false, default: 'USER_ROLE'}
});

module.exports = mongoose.model('Usuario', usuarioSchema);