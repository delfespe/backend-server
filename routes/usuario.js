var express = require('express');
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// ================
// Obtener usuarios
// ================
app.get('/', (req, res, next) => {
    var desde = req.query.desde  || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
    .skip(desde)    
    .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });

                Usuario.count({}, (err, conteo)=>{
                    if (err) return res.status(400).json({
                        ok: false,
                        mensaje: 'Error contando usuarios',
                        errors: err
                    });
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
    
                })
            });

});

// // ================
// // Verifcar token
// // ================
// app.use('/', (req, res, next) => {

//     var token = req.query.token;
//     jwt.verify(token, SEED, (err, decode) =>{
//         if(err) {
//             return res.status(401).json({
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
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    Usuario.findById(id, (err, usuario) => {

        var body = req.body;

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error buscando usuario: ' + id,
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario no encontrado',
                errors: {mensaje: 'El usuario con el id:' + id + ' no existe'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actaulizando usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)'
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});

// ================
// Crear usuarios
// ================
app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando usuarios',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });

});

// ================
// borrar usuario
// ================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
                errors: { mensaje: 'No existe usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
})

module.exports = app;