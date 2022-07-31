const path = require('path');
const {v4: uuidv4} = require('uuid');

// revisar cambios
const subirArchivo = (files,  carpeta = '') => {

    
    return new Promise((resolve, reject) => {
        // console.log(files.files.archivo.name);
        // const { archivo } = files;
        const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

        const archivo = files.files.archivo.name;
        const nombreCortado = archivo.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1];
        
        // Validar Extension
        if(!extensionesValidas.includes(extension)) {
            return reject( `La extension ${extension} no es aceptada, Permitidas ${extensionesValidas}`);
        }

        const nombreTemp = uuidv4() + '.' + extension;  
        // console.log(typeof(nombreTemp));
        // console.log(__dirname);
        const uploadPath = path.join( __dirname, '../uploads', carpeta, nombreTemp );

        archivo.mv(uploadPath, (err) => {   // Indica que se movera hacia la ruta antes indicada
            if (err) {
                reject(err);
            }
           
            resolve( nombreTemp );
        });

    })
    
    
}


module.exports = {
    subirArchivo
}