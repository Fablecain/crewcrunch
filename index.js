// Import necessary Node.js packages
const inquirer = require('inquirer'); // For creating interactive CLI prompts
const mysql = require('mysql2'); // For connecting to MySQL database
require('console.table'); // For displaying query results in table format in the console

// Database connection
const connection = mysql.createConnection({
  host: 'localhost', // Database server (local development usually uses localhost)
  user: 'root', // MySQL username (root is default)
  password: 'C41nF0x6283*', // Password for MySQL user
  database: 'company_db' // Name of the database to connect to
});

// Connect to the MySQL database
connection.connect(err => {
  if (err) throw err; // Handle connection errors
  console.log('Connected to the company_db database.'); // Log successful connection
  mainMenu(); // Call the main menu function to start the application
});

// Main menu function that displays the application's options to the user
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
    // Switch statement to handle the user's choice
    switch (answer.action) {
      case 'View All Departments': viewDepartments(); break; // View all departments
      case 'View All Roles': viewRoles(); break; // View all roles
      case 'View All Employees': viewEmployees(); break; // View all employees
      case 'Add Department': addDepartment(); break; // Add a new department
      case 'Add Role': addRole(); break; // Add a new role
      case 'Add Employee': addEmployee(); break; // Add a new employee
      case 'Update Employee Role': updateEmployeeRole(); break; // Update an employee's role
      case 'Exit': console.log('Exiting...'); connection.end(); break; // Exit the application
    }
  });
}

// Function to view all departments in the database
function viewDepartments() {
  const query = 'SELECT id AS "Department ID", name AS "Department Name" FROM department'; // SQL query
  connection.query(query, (err, results) => { // Execute the query
    if (err) throw err; // Handle errors
    console.table(results); // Display query results in table format
    mainMenu(); // Return to the main menu
  });
}

// Function to view all roles in the database
function viewRoles() {
  const query = `
    SELECT role.id AS "Role ID", role.title AS "Title", role.salary AS "Salary", 
    department.name AS "Department"
    FROM role
    JOIN department ON role.department_id = department.id`; // SQL query
  connection.query(query, (err, results) => { // Execute the query
    if (err) throw err; // Handle errors
    console.table(results); // Display query results in table format
    mainMenu(); // Return to the main menu
  });
}

// Function to view all employees in the database
function viewEmployees() {
  const query = `
    SELECT e.id AS "Employee ID", e.first_name AS "First Name", e.last_name AS "Last Name",
    role.title AS "Role", department.name AS "Department", role.salary AS "Salary",
    CONCAT(m.first_name, ' ', m.last_name) AS "Manager"
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id`; // SQL query
  connection.query(query, (err, results) => { // Execute the query
    if (err) throw err; // Handle errors
    console.table(results); // Display query results in table format
    mainMenu(); // Return to the main menu
  });
}

// Function to add a new department to the database
function addDepartment() {
  inquirer.prompt({
    name: 'departmentName',
    type: 'input',
    message: 'What is the name of the department?',
  }).then(answer => {
    const query = 'INSERT INTO department (name) VALUES (?)'; // SQL query to insert a new department
    connection.query(query, [answer.departmentName], (err, res) => {
      if (err) throw err; // Handle errors
      console.log(`Department added: ${answer.departmentName}`); // Log success message
      mainMenu(); // Return to the main menu
    });
  });
}

// Function to add a new role to the database
function addRole() {
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) throw err; // Handle errors
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
          if (isNaN(value)) return 'Please enter a number.'; // Validate input as a number
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
      const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)'; // SQL query to insert a new role
      connection.query(query, [answers.title, answers.salary, answers.department], (err, res) => {
        if (err) throw err; // Handle errors
        console.log(`Role added: ${answers.title}`); // Log success message
        mainMenu(); // Return to the main menu
      });
    });
  });
}

// Function to add a new employee to the database
function addEmployee() {
  let rolesQuery = 'SELECT id, title FROM role'; // SQL query to select roles
  connection.query(rolesQuery, (err, roles) => {
    if (err) throw err; // Handle errors
    roles = roles.map(role => ({ name: role.title, value: role.id })); // Map roles to a list of choices

    let managersQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee'; // SQL query to select managers
    connection.query(managersQuery, (err, managers) => {
      if (err) throw err; // Handle errors
      managers = managers.map(manager => ({ name: manager.name, value: manager.id })); // Map managers to a list of choices
      managers.unshift({ name: 'None', value: null }); // Add 'None' option for employees with no managers

      inquirer.prompt([
        { name: 'first_name', type: 'input', message: "Employee's first name:" },
        { name: 'last_name', type: 'input', message: "Employee's last name:" },
        { name: 'role_id', type: 'list', message: "Employee's role:", choices: roles },
        { name: 'manager_id', type: 'list', message: "Employee's manager:", choices: managers }
      ]).then(answer => {
        let query = 'INSERT INTO employee SET ?'; // SQL query to insert a new employee
        connection.query(query, answer, (err, res) => {
          if (err) throw err; // Handle errors
          console.log("Employee added successfully."); // Log success message
          mainMenu(); // Return to the main menu
        });
      });
    });
  });
}

// Function to update an employee's role in the database
function updateEmployeeRole() {
  let employeesQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee'; // SQL query to select employees
  connection.query(employeesQuery, (err, employees) => {
    if (err) throw err; // Handle errors
    employees = employees.map(employee => ({ name: employee.name, value: employee.id })); // Map employees to a list of choices

    let rolesQuery = 'SELECT id, title FROM role'; // SQL query to select roles
    connection.query(rolesQuery, (err, roles) => {
      if (err) throw err; // Handle errors
      roles = roles.map(role => ({ name: role.title, value: role.id })); // Map roles to a list of choices

      inquirer.prompt([
        { name: 'employeeId', type: 'list', message: "Which employee's role do you want to update?", choices: employees },
        { name: 'roleId', type: 'list', message: "What's the new role?", choices: roles }
      ]).then(answers => {
        let query = 'UPDATE employee SET role_id = ? WHERE id = ?'; // SQL query to update an employee's role
        connection.query(query, [answers.roleId, answers.employeeId], (err, res) => {
          if (err) throw err; // Handle errors
          console.log("Employee's role updated successfully."); // Log success message
          mainMenu(); // Return to the main menu
        });
      });
    });
  });
}











