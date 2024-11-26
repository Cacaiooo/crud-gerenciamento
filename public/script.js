const API_URL = 'https://crud-gerenciamento.vercel.app/api/employee';

const form = document.getElementById('employeeTable');

// Adicione o evento de envio
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Evita o envio padrão do formulário

  // Pegue os valores dos inputs
  const name = document.getElementById('name').value;
  const position = document.getElementById('position').value;
  const salary = document.getElementById('salary').value;
  const dob = document.getElementById('dob').value;
  const address = document.getElementById('address').value;

  // Envie os dados para a API
  fetch('https://crud-gerenciamento.vercel.app/api/employee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      position,
      salary,
      dob,
      address,
    }),
  })
    .then(response => response.json())  // Converte a resposta para JSON
    .then(data => {
      console.log('Resposta da API ao criar funcionário:', data);
      // Aqui você pode adicionar lógica para exibir a resposta para o usuário
    })
    .catch(error => {
      console.error('Erro na requisição de criação:', error);
      // Lógica para tratar o erro
    });
});

// Função para adicionar funcionário
document.getElementById("addForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Formulário enviado.");

    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const salary = parseFloat(document.getElementById("salary").value);
    const dob = document.getElementById("dob").value;
    const address = document.getElementById("address").value;

    console.log("Dados coletados do formulário:", { name, position, salary, dob, address });

    if (!name || !position || isNaN(salary) || !dob || !address) {
        console.error("Por favor, preencha todos os campos corretamente.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, position, salary, dob, address }),
        });

        console.log("Resposta da API ao criar funcionário:", response);

        if (response.ok) {
            const newEmployee = await response.json();
            console.log("Funcionário criado com sucesso:", newEmployee);
            fetchEmployees(); // Atualiza a lista de funcionários
        } else {
            const errorData = await response.json();
            console.error("Erro ao criar funcionário:", errorData);
        }
    } catch (error) {
        console.error("Erro na requisição de criação:", error);
    }
});

// Função para buscar e exibir os funcionários
async function fetchEmployees() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erro ao buscar funcionários: ${response.statusText}`);
        }
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error("Erro ao buscar funcionários:", error); // Adiciona mais detalhes ao log
    }
}

function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function displayEmployees(employees) {
    const employeeList = document.querySelector("#employeeTable tbody");
    employeeList.innerHTML = "";

    employees.forEach((employee) => {
        const formattedDob = formatDate(employee.dob);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.salary}</td>
            <td>${formattedDob}</td>
            <td>${employee.address}</td>
            <td>
                <button class="btn btn-warning btn-sm edit-btn" data-id="${employee._id}">Editar</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${employee._id}">Excluir</button>
            </td>
        `;
        employeeList.appendChild(row);
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const employeeId = e.target.dataset.id;
            openEditForm(employeeId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const employeeId = e.target.dataset.id;
            deleteEmployee(employeeId);
        });
    });
}

// Inicializa carregando os funcionários
fetchEmployees();
