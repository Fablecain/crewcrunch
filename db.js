const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost', // or your database host
  user: 'root', // your database username
  password: 'C41nF0x6283*', // your database password
  database: 'company_db' // your database name
});

// Open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;
