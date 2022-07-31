const {response} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');
const {googleVerify} = require('../helpers/google-verify');

const login = async(req, res = response) => {
    const {correo, password} = req.body;

    try {
        const usuario = await Usuario.findOne({correo});
        // Verificar si existe el correo
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos'
            })
        }
        
        // Verificar estado del usuario en activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'estado: false'
            })
        }

        // Verificar contraseña
        const validarPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validarPassword) {
            return res.status(400).json({
                msg: 'usuario / password incorrectos'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Contacte a soporte'
        })
    }

    
}



const googleSingIn = async(req, res = response) => {

    const {id_token} = req.body; // obtener token de google sing in

    try {
        const {correo, nombre, img} = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo});

        if(!usuario) {
            const data = {
                nombre,
                correo,
                password: '123',
                img,
                google: true,
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario tiene en estado false
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'contacte al administrador, usuario con estado en false'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        

    } catch (err) {
        res.status(400).json({
            msg: 'Token no verificado'
        })
    }
}
    

const renovarToken = async(req, res = response) => {
    const {usuario} = req;
    const token = await generarJWT(usuario.id);

    res.json({
        usuario, 
        token
    })
}



module.exports = {
    login,
    googleSingIn, 
    renovarToken
}