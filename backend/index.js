const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./db/conection.js'); 
const taskRouters = require('./routers/taskRouters.js'); 
const userRouters = require('./routers/userRouters.js');
const auth = require('./middlewares/auth.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Conexão com o banco de dados
connectDB();

// Rotas
app.use('/api/tasks',auth, taskRouters);
app.use('/api/users', userRouters);
// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});