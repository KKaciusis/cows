import readline from "readline";
import mysql from "mysql";


const ACTION_ADD = 1;
const ACTION_DELETE = 2;
const ACTION_LIST = 3;
const ACTION_EDIT = 4;
const ACTION_FINISH = 0;

let SELECT_ACTION = "";

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
meniu();
function showInfo() {
    console.log(`
        1. Add new cow
        2. Delete a cow
        3. List all cows
        4. Edit cow
        5. End connection
    `);
}

async function meniu(){
    showInfo();
    try {
        SELECT_ACTION = await inputNumber("Choose stuff:  ");
    } catch(err){
        console.log("Please input a number");
    } await main();
}
async function addAction(){
try {
    conn.connect();
    const cowName = await inputText("Please input name : ");
    const cowNickName = await inputText("Please input nick name :  ");
    const cowMilk = await inputText("please input cow milk production ml/hr :  ");
    let {results: r, fields: f} = await query(conn, `insert into cow (name, nickname, milkCount) values(?, ?, ?)`, [cowName, cowNickName, cowMilk]);

    console.log(f);
    console.log(r);
} catch (err){
    console.log("error", err);
} finally {
    conn.end();
}
}
async function deleteAction(){
    
}
async function listAction() {
    try{
        conn.connect();
        let {results: r, fields: f} = await query(conn, `select * from cow`);
        console.log(r);
    } catch(err){
        console.log("failed to read info");
    }
}
async function main(){
    if(SELECT_ACTION === ACTION_FINISH){
        console.log("closing");
        rl.close
    } else {
        if (SELECT_ACTION === ACTION_ADD){
            await addAction();
        } else if (SELECT_ACTION === ACTION_DELETE){
            await deleteAction();
        } else if (SELECT_ACTION === ACTION_EDIT){
            await editAction();
        } else if (SELECT_ACTION === ACTION_LIST){
            await listAction();
        }
    }
}