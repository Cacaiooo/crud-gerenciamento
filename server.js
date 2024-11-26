const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Employee = require('./models/employee');  // Atualizado para o local correto

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());  // Parse JSON no corpo das requisições

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro de conexão ao MongoDB:', err));

// Roteador de funcionários
const employeesRouter = require('./routes/employee');
app.use('/api/employee', employeesRouter);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
