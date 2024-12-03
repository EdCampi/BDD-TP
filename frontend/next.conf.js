require('dotenv').config();

module.exports = {
    env: {
        REACT_APP_MYSQL_API: process.env.REACT_APP_MYSQL_API,
        REACT_APP_MONGO_DB_API: process.env.REACT_APP_MONGO_DB_API
    },
};