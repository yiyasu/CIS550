const express = require("express");
const mysql = require("mysql");

const routes = require("./routes");
const config = require("./config");

const app = express();

// Route 1 - register as GET
app.get("/hello", routes.hello);
app.get("/", (req, res) => {
  res.send(`Hello! Welcome to the AirBnB server!`);
});
app.get("/listing", routes.listing);
app.get("/host", routes.host);
app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
