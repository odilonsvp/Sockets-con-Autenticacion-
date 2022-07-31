const {response} = require('express');


const esAdminRole = (req, res = response, next) => {

    if(!req.usuario) {
        return res.status(500).json({
            msg: 'Se requiere verificar el rol sin validar primero el token'
        })
    }

    const {rol, nombre} = req.usuario;

    if(rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esta accion`
        })
    }

    next();

}


const tieneRole = (...roles) => {

    return (req, res = response, next) => {
        //console.log(roles, req.usuario.rol);

        if(!req.usuario) {
            return res.status(500).json({
                msg: 'Se requiere verificar el rol sin validar primero el token'
            })
        }

        // Valida si el rol que trae este usuario se encuentra en el arreglo de roles
        if(!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de los siguientes roles: ${roles}`
            })
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}