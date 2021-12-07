const express = require("express");
const mysql = require("mysql");
var cors = require("cors");

const routes = require("./routes");
const config = require("./config");

const app = express();
app.use(cors());
app.get("/hello", routes.hello);
app.get("/", (req, res) => {
  res.send(`Hello! Welcome to the AirBnB server!`);
});
app.get("/listing", routes.listing);
app.get("/host", routes.host);
app.get("/all_hosts", routes.all_hosts);
app.get("/all_listings", routes.all_listings);
app.get("/bookings_with_temp", routes.bookings_with_temp);
app.get("/listing/num_bookings", routes.numberbookings);
app.get("/listing/monthly_prices", routes.monthly_prices);
app.get("/listing/reviews", routes.reviews);
app.get("/listing/price_with_temp", routes.price_with_temp);
app.post("/listing/increment_views", routes.increment_views);
app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
