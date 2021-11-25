const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


async function hello(req, res) {
    if (req.query.name) {
        res.send(`Hello, ${req.query.name}! Welcome to the AirBnB server!`)
    } else {
        res.send(`Hello! Welcome to the AirBnB server!`)
    }
}




module.exports = {
    hello
}