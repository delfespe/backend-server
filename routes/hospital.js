var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

// ================
// Obtener
// ================
app.get('/', (request, response, next) => {

    Hospital.find({})
    .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) return response.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                });

                response.status(200).json({
                    ok: true,
                    hospitales: hospitales
                });
            });

});

// ================
// Actualizar 
// ================
app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {

    var id = request.params.id;
    Hospital.findById(id, (err, hospital) => {

        var body = request.body;

        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error buscando hospital: ' + id,
                errors: err
            });
        }

        if (!hospital) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id:' + id + ' no existe',
                errors: err
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = request.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error actaulizando hospital',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});

// ================
// Crear 
// ================
app.post('/', mdAutenticacion.verificaToken, (request, response, next) => {
    var body = request.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: request.usuario._id,
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error creando hospital',
                errors: err
            });
        }
        response.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });

});


// ================
// borrar
// ================
app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {

    var id = request.params.id;
    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error borrando hospital',
                errors: err
            });
        }

        if(!hospitalBorrado){
            return response.status(500).json({
                ok: false,
                mensaje: 'No existe hospital con ese id',
                errors: {mensaje:'No existe hospital con ese id'}
            });
        }

        response.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
})

module.exports = app;