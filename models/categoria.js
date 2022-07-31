const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },

    estado: {
        type: Boolean,
        default: true,
        required: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

// ocultar campos en postman en la request 
CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Categoria', CategoriaSchema) 