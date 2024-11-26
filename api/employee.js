// api/employees.js
const express = require('express');
const Employee = require('../api/employee');
const router = express.Router();

// Rota para listar todos os funcionários
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find(); // Busca todos os funcionários
        res.json(employees); // Retorna a lista de funcionários
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar funcionários' });
    }
});

// Rota para adicionar um novo funcionário
router.post('/', async (req, res) => {
    const { name, position, salary, dob, address } = req.body;
    try {
        const newEmployee = new Employee({ name, position, salary, dob, address });
        await newEmployee.save();
        res.status(201).json(newEmployee); // Retorna o funcionário criado
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar funcionário' });
    }
});

// Rota para buscar funcionário por ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }
        res.json(employee); // Retorna o funcionário encontrado
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar funcionário' });
    }
});

// Rota para editar um funcionário
router.put('/:id', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }
        res.json(updatedEmployee); // Retorna o funcionário atualizado
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar funcionário' });
    }
});

// Rota para excluir um funcionário
router.delete('/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }
        res.json({ message: 'Funcionário excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir funcionário' });
    }
});

module.exports = router;
