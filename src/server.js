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
        0. End connection
    `);
}

async function meniu(){
    conn.connect();
    console.log("Connected to database");
    showInfo();
    try {
        SELECT_ACTION = await inputNumber("Choose stuff :  ");
    } catch(err){
        console.log("Please input a number");
    } await main();
}
async function addAction(){
try {
    const cowName = await inputText("Please input name : ");
    const cowNickName = await inputText("Please input nick name :  ");
    const cowMilk = await inputText("please input cow milk production ml/hr :  ");
    let {results: r, fields: f} = await query(conn, `insert into cow (name, nickname, milkCount) values(?, ?, ?)`, [cowName, cowNickName, cowMilk]);

    console.log(f);
    console.log(r);
} catch (err){
    console.log("error", err);
} 
}
async function deleteAction(){
    try {
        const id = await inputNumber("Please input id, of item to be deleted :  ")
        let {results: r, fields: f} = await query(conn, `delete from cow where id = ?`, [id]);
    }catch(err){
        console.log("failed to delete");
    }
}
async function listAction() {
    try{
        let {results: r, fields: f} = await query(conn, `select * from cow`);
        console.log(r);
    } catch(err){
        console.log("failed to read info");
    }
}
async function editAction(){
    try{
    const id = await inputNumber("Choose by id : ")
    const cowName = await inputText("Edit name : ");
    const cowNickName = await inputText("Edit nick name :  ");
    const cowMilk = await inputText("Edit cow milk production ml/hr :  ");
    let {results: r, fields: f} = await query(conn, ` update cow set name = ?, nickname = ?, milkCount = ? where id = ?`, [cowName, cowNickName, cowMilk, id]);
    } catch(err){
        console.log("failed to edit")
    }
}
async function main(){
    if(SELECT_ACTION === ACTION_FINISH){
        console.log("closing");
        console.log("disconnected from database")
        conn.end();
        rl.close();
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