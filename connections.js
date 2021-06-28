let myql = require("mysql")

let mysqlConnection = myql.createPool({
    host: "localhost:3306",
    user:"root",
    password:"programmerslivelonger",
    database:"tcfl-lib"

})
module.exports = mysqlConnection;