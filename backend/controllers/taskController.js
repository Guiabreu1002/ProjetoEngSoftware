const task = require('../schema/taskSchema');

exports.createTask = async (req, res) => {
    try {
        const newTask = new task(req.body);
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task não encontrada' });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task não encontrada' });
        }
        res.status(200).json({ message: 'Task deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.atualizarPosicao = async (req, res) => {
    try {
        const { taskId, membroId, novaPosicao } = req.body;
        const task = await Task.findById(taskId);
        if (!task) 
            return res.status(404).json({ message: 'Task não encontrada' });

        // atualiza a ordem
        task.ordem = novaPosicao;

        // mover o membro para a primeira posição (remove se existir e adiciona no início)
        const membroIdStr = membroId && membroId.toString ? membroId.toString() : String(membroId);
        const idx = task.membros.findIndex(m => m && m.toString() === membroIdStr);
        if (idx > -1) task.membros.splice(idx, 1);
        task.membros.unshift(membroId);

        // salva alterações
        await task.save();

        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};