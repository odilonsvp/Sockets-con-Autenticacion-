const {Router} = require('express');
const {check} = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

const {esRoleValido, emailExiste, existeUsuarioPorID} = require('../helpers/db-validators');

const { 
    usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosPatch, 
    usuariosDelete } = require('../controllers/usuarios');
const router = Router();


router.get('/', usuariosGet);


router.post('/', [
    check('nombre', 'El nombre es necesario').not().isEmpty(),
    check('password', 'El password debe contener 6 elementos').isLength({min:6}),
    check('correo', 'correo no valido').isEmail(),
    check('correo').custom(emailExiste),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);


router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut)


router.patch('/', usuariosPatch)


router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    validarCampos
], usuariosDelete)


module.exports = router;