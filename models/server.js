const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config');
const fileUpload = require('express-fileUpload');
const {createServer} = require('http');
const {socketController} = require('../sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads',
        }

        // Conexion a base de datos
        this.conectarDB();

        // Middlewares
        this.middeleware();

        // Rutas de la aplicacion
        this.routes();

        // Sockets
        this.sockets();
        
    }

    async conectarDB() {
        await dbConnection();
    }

    middeleware() {
        // Cors
        this.app.use(cors());

        // Lectura y Parseo del Body
        this.app.use(express.json());

        // Directorio Publico
        this.app.use(express.static('public'));

        // Carga de Archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true,
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('listening on port ', this.port);
        })
    }
}

module.exports = Server;