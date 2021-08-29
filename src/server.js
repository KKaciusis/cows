import readline from "readline";
import mysql from "mysql";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function inputText(msg) {
    return new Promise((resolve) =>{
        rl.question(msg, (answer)=>{
            resolve(answer);
        });
    });
}
function inputNumber(msg){
    return new Promise ((resolve, reject) =>{
        rl.question(msg, (answer) => {
            const num = parseFloat(answer);
            if (!isNaN(num) && Number.isFinite(num)){
                resolve(num);
            }else {
                reject(new Error(`${answer} is not a number`));
            }
        });
    });
}

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

try {
    conn.connect();

    const cowName = await inputText("Please input name: ")
    let {results: r, fields: f} = await query(conn, `select * from cow where name='${cowName}'`);

    console.log(f);
    console.log(r);
} catch (err){
    console.log("error", err);
} finally {
    conn.end();
    rl.close();
}




conn.end();
