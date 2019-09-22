var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// ================
// Obtener usuarios
// ================
app.get('/', (request, response, next) => {

    Usuario.find({}, 'nombre email imagen role')
        .exec(
        (err, usuarios) => {
            if (err) return response.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });

            response.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });

});

// // ================
// // Verifcar token
// // ================
// app.use('/', (req, res, next) => {

//     var token = req.query.token;
//     jwt.verify(token, SEED, (err, decode) =>{
//         if(err) {
//             return response.status(401).json({
//                 ok: false,
//                 mensaje: 'Token incorrecto',
//                 errors: err
//             });   
//         }
//         next();
//     });

// });

// ================
// Actualizar usuario
// ================
app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {

    var id = request.params.id;
    Usuario.findById(id, (err, usuario) => {

        var body = request.body;

        if(err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error buscando usuario: ' + id,
                errors: err
            });
        }

        if(!usuario){
            return response.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id:' + id + ' no existe',
                errors: err
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioGuardado) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error actaulizando usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)'
            response.status(200).json({
                ok:true,
                usuario : usuarioGuardado
            });
            
        });

    });

});

// ================
// Crear usuarios
// ================
app.post('/', mdAutenticacion.verificaToken, (request, response, next) => {
    var body = request.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        imagen: body.imagen,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error creando usuarios',
                errors: err
            });
        }
        response.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: request.usuario
        });

    });

});

// ================
// borrar usuario
// ================
app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {

    var id = request.params.id;
    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error borrando usuario',
                errors: err
            });
        }

        if(!usuarioBorrado){
            return response.status(500).json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
                errors: {mensaje:'No existe usuario con ese id'}
            });
        }

        response.status(201).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
})

module.exports = app;