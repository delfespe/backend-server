
// requieres
var express = require('express');
var mongoose = require('mongoose');

// inicializar variables
var app = express();

// conexion base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',
(err, res)=> {
    if(err) { throw err;}
    console.log('Base de datos: \x1b[36m%s\x1b[0m', 'online') ;
}
);

// excuhar peticiones
app.listen(3000, () => {
    console.log('Node/Express: \x1b[36m%s\x1b[0m', 'online');
});

// rutas
app.get('/', (request, response, next) => {

    response.status(200).json({
        ok: true,
        mensaje: 'Peticion ejecutada adecuadamente'
    });
});