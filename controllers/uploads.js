const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);
const {response} = require('express');
const {subirArchivo} = require('../helpers');
const {Usuario, Producto} = require('../models');


 
const cargarArchivo = async(req, res = response) => {
    try {
        // const nombre = await subirArchivo( req.files , ['txt', 'md']);   // textos: indica que debe crearse la carpeta, al tiempo que createParentPath: true, deve configurarse 
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );   // Undefind indica admitir las extenciones sin ser estricto pero que estan definidas 
        res.json({ nombre })
    } catch ( msg ) { 
        res.status(400).json({ msg })
    }
    
}


const actualizarImagen = async(req, res = response) => {

    const {id, coleccion} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'})
    }

    // Limpiar imagenes previas
    if(modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img); /* accede a la carpeta, obtiene la coleccion que viene como argumento, especifica la imagen a borrar */
        if(fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion); // coleccion, la carpeta tomara el nombre de la coleccion que venga como argumento, esto mientras este definida
    modelo.img = nombre;    // Usuario y Producto tienen la propiedad img
    await modelo.save();

    res.json(modelo);
}


const actualizarImagenCloudinary = async(req, res = response) => {

    const {id, coleccion} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'})
    }

    // Limpiar imagenes previas
    if(modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    
    modelo.img = secure_url;
    await modelo.save();
    res.json(modelo);
}


const mostrarImagen = async(req, res = response) => {
    const {id, coleccion} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'})
    }

    // Limpiar imagenes previas
    if(modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img); /* accede a la carpeta, obtiene la coleccion que viene como argumento, especifica la imagen a borrar */
        if(fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen); // Servir la imagen
}



module.exports = {
    cargarArchivo, 
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}