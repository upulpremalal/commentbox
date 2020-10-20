const mysql =require('mysql');

function getconnection(){
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"comments"
    });
    return con;
}
module.exports.getconnection = getconnection;