var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

app.post('/', (request, response, next) => {

    var body = request.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al busrca usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
            });
        }

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });
        usuarioDB.password = ':)';

        response.status(200).json({
            ok: true,
            usuario: usuarioDB,
            id: usuarioDB._id,
            token: token
        });
    });

});


module.exports = app;