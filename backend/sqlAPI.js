require('dotenv').config();

const express = require('express');
const routerSQL = express.Router();
const mysql = require('mysql2');
const connectionSQL = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

routerSQL.get('/', (req, res) => {
    connectionSQL.query(
        `SELECT * FROM restaurants`,
        (err, result) => {
            if (err) {
                return res.json({message: 'Error fetching users', error: err});
            } else {
                return res.json({message: 'Users fetched successfully', data: result});
            }
        }
    );
});

routerSQL.post('/', (req, res) => {
    const {restaurant, rating, category, price, address, phone} = req.body;
    connectionSQL.query(
        `INSERT INTO restaurants (name, rating, category, price, address, phone) VALUES (?, ?, ?, ?, ?, ?)`, //(?, ? ...) prevents SQL injection
        [restaurant, rating, category, price, address, phone],
        (err, result) => {
            if (err) {
                return res.json({message: 'Error saving user', error: err});
            } else {

                return res.json({message: 'User saved successfully'});
            }
        }
    );
});

routerSQL.delete('/:id', (req, res) => {
    const {id} = req.params;
    connectionSQL.query(
        'DELETE FROM restaurants WHERE id=?',
        [parseInt(id)],
        (err, result) => {
            if (err) {
                return res.json({message: 'Error deleting user', error: err});
            } else {
                return res.json({message: 'User deleted successfully'});
            }
        }
    );
});


routerSQL.put('/:id', (req, res) => {
    const {id} = req.params;
    const {restaurant, rating, category, price, address, phone} = req.body;
    connectionSQL.query(
        `UPDATE restaurants SET name=?, category=?, price=?, address=?, phone=? WHERE id=?`,
        [restaurant, category, price, address, phone, parseInt(id)],
        (err, result) => {
            if (err) {
                return res.json({message: 'Error updating user', error: err});
            } else {
                return res.json({message: 'User updated successfully'});
            }
        }
    );
});

routerSQL.get('/restaurants', (req, res) => {
    connectionSQL.query(
        `SELECT name FROM restaurants`,
        (err, result) => {
            if (err) {
                return res.json({message: "error"});
            } else {
                return res.json({message: "success", data: result});
            }
        }
    );
});

module.exports = {routerSQL, connectionSQL};
