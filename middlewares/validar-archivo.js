const {response} = require('express');

// antes async
const validarArchivoSubir = async(req, res = response, next) => {
    // Verifica que venga un archivo a subir
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({ 
            msg: 'No hay archivos que subir - validarArchivoSubir verifico esta accion' 
        });
    }
    next();
}

module.exports = {
    validarArchivoSubir
}