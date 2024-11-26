const express = require('express');
const Employee = mongoose.model('Employee', employeeSchema);
const router = express.Router();

// Rota para listar todos os funcionários
router.get('/', async (req, res) => {
    console.log("Recebendo requisição para listar todos os funcionários");
    try {
        const employees = await Employee.find(); // Busca todos os funcionários no banco
        console.log("Funcionários encontrados:", employees);
        res.json(employees);
    } catch (error) {
        console.error("Erro ao listar funcionários:", error);
        res.status(500).json({ message: 'Erro ao listar funcionários' });
    }
});

// Rota para buscar funcionário por ID
router.get('/', async (req, res) => {
    console.log("Recebendo requisição para listar todos os funcionários");
    try {
        const employees = await Employee.find(); // Busca todos os funcionários no banco
        console.log("Funcionários encontrados:", employees);
        res.json(employees);
    } catch (error) {
        console.error("Erro ao listar funcionários:", error);
        res.status(500).json({ message: 'Erro ao listar funcionários' });
    }
});


// Rota para adicionar um novo funcionário
router.post('/', async (req, res) => {
  const { name, position, salary, dob, address } = req.body;

  if (!name || !position || !salary || !dob || !address) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const employee = new Employee({ name, position, salary, dob, address });
    await employee.save();

    console.log("Funcionário criado:", employee);
    res.status(201).json(employee);
  } catch (err) {
    console.error('Erro ao salvar funcionário:', err);
    res.status(500).json({ message: 'Erro ao salvar funcionário' });
  }
});

// Rota para excluir um funcionário
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
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
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, position, salary, dob, address } = req.body;

  if (!name || !position || !salary || !dob || !address) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
      const updatedEmployee = await Employee.findByIdAndUpdate(
          id,
          { name, position, salary, dob, address },
          { new: true }
      );

      if (!updatedEmployee) {
          return res.status(404).json({ message: 'Funcionário não encontrado' });
      }

      res.json(updatedEmployee);
  } catch (err) {
      console.error("Erro ao atualizar funcionário:", err);
      res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router; // Exporta o roteador
module.exports = Employee;
