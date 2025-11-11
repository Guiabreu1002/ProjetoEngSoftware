const mongoose = require('mongoose');

const etiquetasSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true }
    });

module.exports = mongoose.model('Etiquetas', etiquetasSchema);