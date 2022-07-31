
const {Schema, model} = require('mongoose');

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        inique: true,
    },

    password: {
        type: String,
        required: [true, 'El password es obligatorio'],
    },

    img: {
        type: String,
    },

    rol: {
        type:String,
        required: [true, 'El role es obligatorio'],
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },

    estado : {
        type: Boolean,
        default: true,
    },

    google: {
        type: Boolean,
        default: false,
    }
})

// ocultar campos en postman en la request 
usuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id; // Renombrando propiedad
    return usuario;
}

module.exports = model('Usuario', usuarioSchema);