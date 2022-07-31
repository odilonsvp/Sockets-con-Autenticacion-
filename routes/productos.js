const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const   { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto,
        borrarProducto
        } = require('../controllers/productos');

const { existeCategoriaPorId } = require('../helpers/db-validators');
const { existeProductoPorId } = require('../helpers/db-validators');


const router = Router();


// Obtener todas las Productos
router.get('/', obtenerProductos);


// Obtener un Producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProducto);


// Crear Producto - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);


// Actualizar - privado - cualquiera con un token valido
router.put('/:id', [
    validarJWT,
    //check('categoria', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);


// Borrar un Producto -Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],  borrarProducto);

module.exports = router;