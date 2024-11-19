const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: 'root',
    database: 'ticket_reservation',
    charset: "utf8mb4",
});


module.exports = db;
