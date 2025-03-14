const mysql = require("mysql2");
require("dotenv").config();



const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


// pool.query(
//   'SELECT * FROM `users`',
//   function (err, results, fields) {
//     if (err) {
//       console.error('Error executing query:', err);
//       return;
//     }
//     console.log('Query results:', results);
//     console.log('Query fields:', fields);
// });

// pool.query(
//   'SELECT * FROM `topics`',
//   function (err, results, fields) {
//     if (err) {
//       console.error('Error executing query:', err);
//       return;
//     }
//     console.log('Query results:', results);
// console.log('Query fields:', fields);
// });

module.exports = pool.promise();
