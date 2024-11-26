const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Employee = require('./api/employee');
const dotenv = require('dotenv');
const employeesRouter = require('./api/employee'); // Importe o roteador

dotenv.config();

const app = express();

// Usando a variável PORT do Vercel, ou fallback para a porta 5000 em desenvolvimento local
const port = process.env.PORT || 5000;

// Middleware
app.use(express.static('public'));
app.use(cors()); // Permitir requisições CORS
app.use(express.json()); // Parse JSON no corpo das requisições

// Conectar ao MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((err) => {
    console.error('Erro de conexão ao MongoDB:', err);
  });


app.use('./api/employee.js', employeesRouter); // Rota para gerenciamento de funcionários

// Inicia o servidor na porta configurada
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


// Rota para listar um funcionário pelo ID
app.get('/', async (req, res) => {
    console.log("Recebendo requisição para listar todos os funcionários"); // Log de requisição
    try {
        const employees = await Employee.find(); // Busca todos os funcionários no banco
        console.log("Funcionários encontrados:", employees); // Log dos funcionários encontrados
        res.json(employees);
    } catch (error) {
        console.error("Erro ao listar funcionários:", error); // Log de erro
        res.status(500).json({ message: 'Erro ao listar funcionários' });
    }
});

// Rota para buscar funcionário por ID
app.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const employee = await Employee.findById(id);
      if (!employee) {
          return res.status(404).json({ message: 'Funcionário não encontrado' });
      }
      res.json(employee);
  } catch (error) {
      console.error('Erro ao buscar funcionário:', error);
      res.status(500).json({ message: 'Erro ao buscar funcionário' });
  }
});

// Rota para adicionar um novo funcionário
app.post('/', async (req, res) => {
  const { name, position, salary, dob, address } = req.body;

  if (!name || !position || !salary || !dob || !address) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const employee = new Employee({ name, position, salary, dob, address });
    await employee.save();

    console.log("Funcionário criado:", employee);  // Log para verificar
    res.status(201).json(employee); // Retorna o funcionário recém-criado
  } catch (err) {
    console.error('Erro ao salvar funcionário:', err);
    res.status(500).json({ message: 'Erro ao salvar funcionário' });
  }
});

// Rota para excluir um funcionário
app.delete('/:id', async (req, res) => {
    const { id } = req.params; // ID recebido da URL
    console.log('Recebendo requisição DELETE para o ID:', id);

    try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            console.error('Funcionário não encontrado para exclusão:', id);
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }

        console.log('Funcionário excluído com sucesso:', deletedEmployee);
        res.json({ message: 'Funcionário excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir funcionário:', err);
        res.status(500).json({ message: 'Erro ao excluir funcionário' });
    }
});

// Rota para editar um funcionário
app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, position, salary, dob, address } = req.body;

  if (!name || !position || !salary || !dob || !address) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
      const updatedEmployee = await Employee.findByIdAndUpdate(
          id,
          { name, position, salary, dob, address },
          { new: true } // Retorna o documento atualizado
      );

      if (!updatedEmployee) {
          return res.status(404).json({ message: 'Funcionário não encontrado' });
      }

      res.json(updatedEmployee); // Retorna o funcionário atualizado
  } catch (err) {
      console.error("Erro ao atualizar funcionário:", err);
      res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Inicia o servidor na porta configurada
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
