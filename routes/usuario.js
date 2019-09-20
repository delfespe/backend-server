var express = require('express');
var bcrypt = require('bcryptjs');

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
        })

});

// ================
// Actualizar usuario
// ================
app.put('/:id', (request, response) => {

    var id = request.params.id;

    response.status(200).json({
        ok:true,
        id:id
    });
});

// ================
// Crear usuarios
// ================
app.post('/', (request, response, next) => {
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
            usuario: usuarioGuardado
        });

    });

});


module.exports = app;