import mysql from 'mysql';

const conn = mysql.createConnection({
    host: "localhost",
    database: "cow_tier_list",
    user: "Bloten",
    password: "milkexpert3000",
});

function query(conn, sql, params){
    return new Promise((resolve, reject) =>{
        conn.query(sql, params, (err, results, fields) =>{
            if (err){
               return reject(err);
            }
            resolve({
                results,
                fields
            });
        });
    });
}

conn.connect();
console.log("connected")
let {results: r, fields: f} = await query(conn, "select * from cow where name='Marge'");

console.log(f);
console.log(r);



conn.end();
