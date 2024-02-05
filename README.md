# CrewCrunch - Employee Management System
CrewCrunch is a command-line based Employee Management System that allows users to efficiently manage departments, roles, and employees within an organization. This application provides a user-friendly interface for viewing, adding, and updating employee information, making it an essential tool for businesses of all sizes.

[Module 12 Challenge.webm](https://github.com/Fablecain/crewcrunch/assets/139589280/42b6eb30-1805-4fb5-b215-372965eaec72)

## Features
View all departments, roles, and employees in a neatly formatted table.
Add new departments, roles, and employees with ease.
Update an employee's role to reflect changes within the organization.
Prerequisites
Before you begin, ensure you have met the following requirements:

Node.js installed on your local machine.
MySQL database set up with the necessary tables (See Database Setup for details).
Clone this repository to your local machine.

## Installation
To install the required dependencies, run the following command:


npm install
Usage
Configure Database Connection:

Open index.js.
Modify the connection object with your MySQL database credentials.
Run the application:


node index.js
Follow the on-screen prompts to manage employees, departments, and roles.
Database Setup
The application assumes the following database schema:

## Departments Table
id (INT PRIMARY KEY)
name (VARCHAR(30)) - Department name
## Roles Table
id (INT PRIMARY KEY)
title (VARCHAR(30)) - Role title
salary (DECIMAL) - Role salary
department_id (INT) - Reference to the department the role belongs to
## Employees Table
id (INT PRIMARY KEY)
first_name (VARCHAR(30)) - Employee first name
last_name (VARCHAR(30)) - Employee last name
role_id (INT) - Reference to the employee's role
manager_id (INT) - Reference to another employee that is the manager (null if none)


## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments
Built with Node.js, MySQL, and the Inquirer.js library.
