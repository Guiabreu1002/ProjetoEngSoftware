const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    status: { type: String, enum: ['Pendente', 'Em Progresso', 'Completa'], default: 'Pendente'},
    dueDate: { type: Date, required: true}
    });

module.exports = mongoose.model('Task', taskSchema);