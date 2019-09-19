# backend-server
Express
servidor de peticiones rest
https://expressjs.co

# Inicio
md backend-service
cd backend-service

crea package.json
npm init 

instala node y lo pone en dependencias solo del proyecto
npm install express --save

instala demonio verificador cambios solo proyecto y desarrollo
npm install --save-dev nodemon

para usarlo ponerlo en el package.json
  "scripts": {
    "start": "nodemon app.js",

  ...
  npm start

# Colores para la consola express
Reset = "\x1b[0m"

Bright = "\x1b[1m"

Dim = "\x1b[2m"

Underscore = "\x1b[4m"

Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"
FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"
BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"


# MongoDb
sistema de base de datos NoSQL orientado a documentos de código abierto, usa archivos BSON
https://docs.mongodb.com/manual/installation/
puerto 27017
gui: https://robomongo.org/

# MonGooseJs
mongodb object modeling for node.js
https://mongoosejs.com/
npm install mongoose --save

