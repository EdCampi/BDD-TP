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

const validations = require('./sqlValidation.js');

async function validateRestaurantData({restaurant, category, price, address, city, province, phone, connectionSQL}) {
    return validations.validateFields({restaurant, category, price, address, city, province, phone}) ||
        validations.validateInput({category, price, address, city, province, phone}) ||
        await validations.verifyDuplicatedAddress(restaurant, address, city, province, connectionSQL) ||
        await validations.verifyDuplicatedPhone(phone, connectionSQL) ||
        await validations.verifyDuplicatedRestaurant(restaurant, connectionSQL);
}

async function validateUpdateData({restaurant, category, price, address, city, province, phone, connectionSQL}) {
    return validations.validateFields({restaurant, category, price, address, city, province, phone}) ||
        validations.validateInput({category, price, address, city, province, phone});
}

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

routerSQL.post('/', async (req, res) => {
    const {restaurant, rating, category, price, address, city, province, phone} = req.body;
    let validationError = await validateRestaurantData({restaurant, category, price, address, city, province, phone, connectionSQL});
    if (validationError) {
        return res.status(400).json({message: validationError});
    }
    connectionSQL.query(`SELECT * FROM restaurants WHERE address=? AND CITY=? AND province=?`, [restaurant, address, city, province], (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({message: 'Another restaurant has this address registered.'});
        }
        connectionSQL.query(
            `INSERT INTO restaurants (name, rating, category, price, address, city, province, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, //(?, ? ...) prevents SQL injection
            [restaurant, rating, category, price, address, city, province, phone],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({message: 'Another estaurant has the same address'});
                    }
                    return res.status(400).json({message: 'Error saving user'});
                }
                return res.status(201).json({message: 'User saved successfully'});
            }
        );
    });
});



routerSQL.delete('/:id', (req, res) => {
    const {id} = req.params;
    if (!validations.verifyId(id)) {
        return res.status(400).json({message: 'Please enter a valid id'});
    }
    connectionSQL.query(
        'DELETE FROM restaurants WHERE id=?',
        [parseInt(id)],
        (err) => {
            if (err) {
                return res.status(400).json({message: 'Error deleting user', error: err});
            }
            return res.status(201).json({message: 'User deleted successfully'});
        }
    );
});



routerSQL.put('/:id', async (req, res) => {
    const {id} = req.params;
    if (!validations.verifyId(id)) {
        return res.status(400).json({message: 'Please enter a valid id'});
    }

    const {restaurant, category, price, address, city, province, phone} = req.body;
    let validationError = await validateUpdateData({restaurant, category, price, address, city, province, phone, connectionSQL});
    if (validationError) {
        return res.status(400).json({message: validationError});
    }

    connectionSQL.query(
        `UPDATE restaurants SET name=?, category=?, price=?, address=?, city=?, province=?, phone=? WHERE id=?`,
        [restaurant, category, price, address, city, province, phone, parseInt(id)],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log('dup');
                    return res.status(400).json({message: 'Restaurant already exists'});
                }
                console.log('err2');
                return res.status(400).json({message: 'Error updating user'});
            }
            return res.status(201).json({message: 'User updated successfully'});
        }
    );
});

routerSQL.get('/restaurants', (req, res) => {
    connectionSQL.query(
        `SELECT name FROM restaurants`,
        (err, result) => {
            if (err) {
                return res.json({message: "error"});
            }
            return res.json({message: "success", data: result});
        }
    );
});

module.exports = {routerSQL, connectionSQL};
