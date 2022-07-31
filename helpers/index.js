const dbValidators  = require('./db-validators');
const generarJWT    = require('./generarJWT');
const googleVerify  = require('./google-verify');
const subirArchivo  = require('./subir-archivo');
const comprobarJWT  = require('./generar-jwt');

module.exports = {
    ...dbValidators, /* Indica el acceso a todas sus Propiedades */
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
    ...comprobarJWT
}