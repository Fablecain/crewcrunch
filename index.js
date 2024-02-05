const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'C41nF0x6283*', 
  database: 'company_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the company_db database.');
  mainMenu();
});

function mainMenu() {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add Department',
      'Add Role',
      'Add Employee',
      'Update Employee Role',
      'Exit'
    ],
  }).then(answer => {
    switch (answer.action) {
      case 'View All Departments':
        viewDepartments();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'View All Employees':
        viewEmployees();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Exit':
        console.log('Exiting...');
        connection.end();
        break;
    }
  });
}

function viewDepartments() {
  const query = 'SELECT id AS "Department ID", name AS "Department Name" FROM department';
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  });
}

function viewRoles() {
  const query = `
    SELECT role.id AS "Role ID", role.title AS "Title", role.salary AS "Salary", 
           department.name AS "Department"
    FROM role
    JOIN department ON role.department_id = department.id`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  });
}

function viewEmployees() {
  const query = `
    SELECT e.id AS "Employee ID", e.first_name AS "First Name", e.last_name AS "Last Name",
           role.title AS "Role", department.name AS "Department", role.salary AS "Salary",
           CONCAT(m.first_name, ' ', m.last_name) AS "Manager"
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  });
}

function addDepartment() {
  inquirer.prompt({
    name: 'departmentName',
    type: 'input',
    message: 'What is the name of the department?',
  }).then(answer => {
    const query = 'INSERT INTO department (name) VALUES (?)';
    connection.query(query, [answer.departmentName], (err, res) => {
      if (err) throw err;
      console.log(`Department added: ${answer.departmentName}`);
      mainMenu();
    });
  });
}

function addRole() {
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'What is the title of the role?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for this role?',
        validate: value => {
          if (isNaN(value)) return 'Please enter a number.';
          return true;
        }
      },
      {
        name: 'department',
        type: 'list',
        choices: departments.map(dept => ({ name: dept.name, value: dept.id })),
        message: 'Which department does this role belong to?',
      }
    ]).then(answers => {
      const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
      connection.query(query, [answers.title, answers.salary, answers.department], (err, res) => {
        if (err) throw err;
        console.log(`Role added: ${answers.title}`);
        mainMenu();
      });
    });
  });
}

function addEmployee() {
  let rolesQuery = 'SELECT id, title FROM role';
  connection.query(rolesQuery, (err, roles) => {
    if (err) throw err;
    roles = roles.map(role => ({ name: role.title, value: role.id }));

    let managersQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';
    connection.query(managersQuery, (err, managers) => {
      if (err) throw err;
      managers = managers.map(manager => ({ name: manager.name, value: manager.id }));
      managers.unshift({ name: 'None', value: null });

      inquirer.prompt([
        { name: 'first_name', type: 'input', message: "Employee's first name:" },
        { name: 'last_name', type: 'input', message: "Employee's last name:" },
        { name: 'role_id', type: 'list', message: "Employee's role:", choices: roles },
        { name: 'manager_id', type: 'list', message: "Employee's manager:", choices: managers }
      ]).then(answer => {
        let query = 'INSERT INTO employee SET ?';
        connection.query(query, answer, (err, res) => {
          if (err) throw err;
          console.log("Employee added successfully.");
          mainMenu();
        });
      });
    });
  });
}

function updateEmployeeRole() {
  let employeesQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';
  connection.query(employeesQuery, (err, employees) => {
    if (err) throw err;
    employees = employees.map(employee => ({ name: employee.name, value: employee.id }));

    let rolesQuery = 'SELECT id, title FROM role';
    connection.query(rolesQuery, (err, roles) => {
      if (err) throw err;
      roles = roles.map(role => ({ name: role.title, value: role.id }));

      inquirer.prompt([
        { name: 'employeeId', type: 'list', message: "Which employee's role do you want to update?", choices: employees },
        { name: 'roleId', type: 'list', message: "What's the new role?", choices: roles }
      ]).then(answers => {
        let query = 'UPDATE employee SET role_id = ? WHERE id = ?';
        connection.query(query, [answers.roleId, answers.employeeId], (err, res) => {
          if (err) throw err;
          console.log("Employee's role updated successfully.");
          mainMenu();
        });
      });
    });
  });
}











