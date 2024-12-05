require('dotenv').config();

const setupDatabase = require('./setupDatabase');
setupDatabase();

const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

// Creo la database SQL


app.use(express.json());
const routerSQL = require('./sqlAPI.js');
app.use('/sqlAPI', routerSQL);
const mongoDbAPIRouter = require('./mongoDbAPI');
app.use('/mongoDbAPI', mongoDbAPIRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
