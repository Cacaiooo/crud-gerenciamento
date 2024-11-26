const express = require('express');
const Employee = require('../models/employee');  // Modelo correto
const router = express.Router();

// Rota para listar todos os funcionários
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();  // Busca todos os funcionários
    res.json(employees);
  } catch (error) {
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
    const newEmployee = new Employee({ name, position, salary, dob, address });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar funcionário' });
  }
});

// Rota para excluir um funcionário
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    res.json({ message: 'Funcionário excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir funcionário' });
  }
});

// Rota para editar um funcionário
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, position, salary, dob, address } = req.body;

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
    res.status(500).json({ message: 'Erro ao atualizar funcionário' });
  }
});

module.exports = router;
