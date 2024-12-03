require('dotenv').config();

const fs = require('fs');
const mysql = require('mysql2');

function setupDatabase() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    const sql = fs.readFileSync('./setupDB.sql', 'utf8');
    const statements = sql.split(';').map(stmt => stmt.trim()).filter(stmt => stmt);

    // Execute each statement separately
    statements.forEach((statement, index) => {
        connection.query(statement, (err, res) => {
            if (err) {
                console.log(`Error executing statement ${index + 1}:`, err);
                process.exit(1);
            }
            if (index === statements.length - 1) {
                console.log("Database setup completed successfully.");
                connection.end();
            }
        });
    });
}

module.exports = setupDatabase;
