var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

// ================
// Obtener
// ================
app.get('/', (request, response, next) => {

    Medico.find({})
    .populate('usuario', 'nombre email')
    .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) return response.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });

                response.status(200).json({
                    ok: true,
                    medicos: medicos
                });
            });

});

// ================
// Actualizar 
// ================
app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {

    var id = request.params.id;
    Medico.findById(id, (err, medico) => {

        var body = request.body;

        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error buscando medico: ' + id,
                errors: err
            });
        }

        if (!medico) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El medico con el id:' + id + ' no existe',
                errors: err
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = request.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error actaulizando medico',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});

// ================
// Crear 
// ================
app.post('/', mdAutenticacion.verificaToken, (request, response, next) => {
    var body = request.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: request.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error creando medico',
                errors: err
            });
        }
        response.status(201).json({
            ok: true,
            medico: medicoGuardado
        });

    });

});


// ================
// borrar
// ================
app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {

    var id = request.params.id;
    Medico.findByIdAndDelete(id, (err, medicoBorrado) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error borrando medico',
                errors: err
            });
        }

        if(!medicoBorrado){
            return response.status(500).json({
                ok: false,
                mensaje: 'No existe medico con ese id',
                errors: {mensaje:'No existe medico con ese id'}
            });
        }

        response.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
})

module.exports = app;