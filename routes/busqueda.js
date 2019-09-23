var express = require('express');

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

var app = express();

// ===================
// busqueda especifica
// ===================
app.get('/coleccion/:tabla/:busqueda', (request, response, next) => {
    var tabla = request.params.tabla;
    var busqueda = request.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'hospital':
            promesa = buscarHospitales(regex)
            break;
        case 'medico':
            promesa = buscarMedicos(regex)
            break;
        case 'usuario':
            promesa = buscarUsuarios(regex)
            break;
        default:
            response.status(400).json({
                ok: false,
                mensaje: 'Las coleciones son: medico, hospital, usuario',
                error: 'No existe la coleccion: ' + tabla
            });
            break;
    }
    promesa.then(lista => {
        response.status(200).json({
            ok: true,
            [tabla]: lista
        });
    })

});

// ===================
// busqueda general
// ===================
app.get('/todo/:busqueda', (request, response, next) => {

    var busqueda = request.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex)
    ])
        .then(respuestas => {
            response.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        })

});

function buscarHospitales(regex) {
    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('error cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    })
}

function buscarMedicos(regex) {
    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, lista) => {
                if (err) {
                    reject('error cargar medicos', err);
                } else {
                    resolve(lista);
                }
            });
    })
}

function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, lista) => {
                if (err) {
                    reject('error cargar usuarios', err);
                } else {
                    resolve(lista);
                }
            });
    })
}

module.exports = app;