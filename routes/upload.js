var express = require('express');

var fileUpload = require('express-fileupload');

var fs = require('fs');

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

var app = express();

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;
    var tiposValidos = ['medico', 'hospital', 'usuario'];

    if (tiposValidos.indexOf(tipo) < 0) return res.status(400).json({
        ok: false,
        mensaje: 'Tipo de coleccion no valido',
        errors: { mensaje: 'Las colecciones son:' + tiposValidos }
    });

    if (!req.files) return res.status(400).json({
        ok: false,
        mensaje: 'Error cargando archivo',
        errors: { mensaje: 'Debe seleccionar un archivo' }
    });

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    var extensionesValidas = ['png', 'jpg', 'gif'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'extension no valida',
            errors: { mensaje: 'Las extensiones son: ' + extensionesValidas }
        });
    }

    var nombreArchivo = `${id}- ${new Date().getMilliseconds()}.${extensionArchivo}`;
    var path = `./upload/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);

    })

});
function subirPorTipo(tipo, id, nombreArchivo, res) {
    var tabla;
    if (tipo === 'usuario') {
        Usuario.findById(id, (err, usuario) => {
            if (err) return res.status(400).json({
                ok: false,
                mensaje: 'Error buscando usuario',
                errors: err
            });
            
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no encontrado',
                    errors: {mensaje: 'El usuario con el id:' + id + ' no existe'}
                });
            }
    
            var pathViejo = `./upload/${tipo}/${usuario.img}`;
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error actualizando imagen de usuario',
                        errors: err
                    });
                }
                usuarioGuardado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuario: usuarioGuardado
                })
            });
        });
    } else if (tipo === 'hospital') {
        Hospital.findById(id, (err, hospital) => {
            if (err) return res.status(400).json({
                ok: false,
                mensaje: 'Error buscando hospital',
                errors: err
            });
            
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'hospital no encontrado',
                    errors: {mensaje: 'El hospital con el id:' + id + ' no existe'}
                });
            }
    
            var pathViejo = `./upload/${tipo}/${hospital.img}`;
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error actualizando imagen de hospital',
                        errors: err
                    });
                }
                
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizado',
                    hospital: hospitalGuardado
                })
            });
        });
    } else if (tipo === 'medico') {
        Medico.findById(id, (err, medico) => {
            if (err) return res.status(400).json({
                ok: false,
                mensaje: 'Error buscando medico',
                errors: err
            });
            
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'medico no encontrado',
                    errors: {mensaje: 'El medico con el id:' + id + ' no existe'}
                });
            }
    
            var pathViejo = `./upload/${tipo}/${medico.img}`;
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error actualizando imagen de medico',
                        errors: err
                    });
                }
                
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizado',
                    medico: medicoGuardado
                })
            });
        });
    }

}
module.exports = app;
