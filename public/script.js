const API_URL = 'https://crud-gerenciamento.vercel.app/api/employee';  // URL da API no Vercel

// Função para adicionar funcionário
document.getElementById("addForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const salary = parseFloat(document.getElementById("salary").value);
    const dob = document.getElementById("dob").value;
    const address = document.getElementById("address").value;

    if (!name || !position || isNaN(salary) || !dob || !address) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, position, salary, dob, address }),
        });

        const newEmployee = await response.json();
        if (response.ok) {
            alert("Funcionário criado com sucesso");
            fetchEmployees();  // Atualiza a lista de funcionários
        } else {
            alert("Erro ao criar funcionário");
        }
    } catch (error) {
        alert("Erro na requisição de criação");
        console.error('Erro na requisição:', error);
    }
});

// Função para buscar e exibir os funcionários
async function fetchEmployees() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Erro ao buscar funcionários');
        }
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        alert("Erro ao buscar funcionários");
        console.error('Erro:', error);
    }
}

// Exibir os funcionários
function displayEmployees(employees) {
    const employeeList = document.querySelector("#employeeTable tbody");
    employeeList.innerHTML = "";

    employees.forEach(employee => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.salary}</td>
            <td>${new Date(employee.dob).toLocaleDateString()}</td>
            <td>${employee.address}</td>
            <td>
                <button class="edit-btn" data-id="${employee._id}">Editar</button>
                <button class="delete-btn" data-id="${employee._id}">Excluir</button>
            </td>
        `;
        employeeList.appendChild(row);
    });

    // Adicionando evento para editar e excluir funcionários
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            await deleteEmployee(id);
        });
    });
}

// Excluir funcionário
async function deleteEmployee(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert("Funcionário excluído com sucesso");
            fetchEmployees();  // Atualiza a lista de funcionários
        } else {
            alert("Erro ao excluir funcionário");
        }
    } catch (error) {
        alert("Erro ao excluir funcionário");
        console.error('Erro:', error);
    }
}

// Carregar funcionários na inicialização
fetchEmployees();
