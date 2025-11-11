const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    titulo: { type: String, required: true},
    descricao: { type: String, required: true},
    ordem: { type: Number, required: true, default: 0},
    etiqueta: {type: mongoose.Schema.Types.ObjectId, ref: 'Etiquetas' },
    dueDate: { type: Date, required: true},
    dono: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    membros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    });

module.exports = mongoose.model('Task', taskSchema);