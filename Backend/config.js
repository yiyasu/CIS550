require("dotenv").config();

const config = {
  rds_host: process.env.RDS_HOST,
  rds_port: process.env.RDS_PORT,
  rds_user: process.env.RDS_USER,
  rds_password: process.env.RDS_PASSWORD,
  rds_db: "AirBnB_Project",
  server_host: "127.0.0.1",
  server_port: "8080",
};

module.exports = config;
