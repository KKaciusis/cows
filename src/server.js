import mysql from 'mysql';

const conn = mysql.createConnection({
    host: "localhost",
    user: "Bloten",
    password: "milkexpert3000",
});

conn.connect();
console.log("connected")
conn.end();
