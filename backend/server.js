require('dotenv').config();

const cors = require('cors');
const express = require('express');
const setupDatabase = require('./setupDatabase');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

// Creo la database SQL
setupDatabase();

app.use(express.json());
const {routerSQL, _} = require('./sqlAPI.js');
app.use('/sqlAPI', routerSQL);
const mongoDbAPIRouter = require('./mongoDbAPI');
app.use('/mongoDbAPI', mongoDbAPIRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
