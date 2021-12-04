const config = require("./config");
const mysql = require("mysql");
const e = require("express");

const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect();

async function hello(req, res) {
  if (req.query.name) {
    res.send(`Hello, ${req.query.name}! Welcome to the AirBnB server!`);
  } else {
    res.send(`Hello! Welcome to the AirBnB server!`);
  }
}

// info for 1 listing by id
async function listing(req, res) {
  const listingId = req.query.id;
  console.log(listingId);
  if (!listingId) {
    res.status(404).json({ message: "id not selected" });
  } else {
    connection.query(
      `select
        id,
        listing_url,
        name,
        summary,
        space,
        description,
        experiences_offered,
        transit,
        thumbnail_url,
        host_name,
        host_about,
        host_thumbnail_url
        from Listing l, Host h
        where h.host_id = l.host_id and id=${listingId};
        `,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ listing: results[0] });
        }
      }
    );
  }
}

// info for 1 host by id
async function host(req, res) {
  const hostId = req.query.id;
  console.log(hostId);
  if (!hostId) {
    res.status(404).json({ message: "id not selected" });
  } else {
    connection.query(
      `select
        id,
        listing_url,
        name,
        summary,
        space,
        description,
        thumbnail_url,
        h.host_id,
        host_name,
        host_since,
        host_location,
        host_about,
        host_response_time,
        host_response_rate,
        host_acceptance_rate,
        host_is_superhost,
        host_thumbnail_url,
        host_picture_url,
        host_total_listings_count,
        host_has_profile_pic
        from Listing l, Host h
        where h.host_id = l.host_id and l.host_id=${hostId};
          `,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          // format results to get listings in array
          const {
            host_id,
            host_name,
            host_since,
            host_location,
            host_about,
            host_response_time,
            host_response_rate,
            host_acceptance_rate,
            host_is_superhost,
            host_thumbnail_url,
            host_picture_url,
            host_total_listings_count,
            host_has_profile_pic,
          } = results[0];
          const listings = results.map(
            ({
              id,
              listing_url,
              name,
              summary,
              space,
              description,
              thumbnail_url,
            }) => ({
              listing_id: id,
              listing_name: name,
              listing_url: listing_url,
              listing_summary: summary,
              listing_space: space,
              listing_description: description,
              listing_thumbnail_url: thumbnail_url,
            })
          );
          res.json({
            host_id,
            host_name,
            host_since,
            host_location,
            host_about,
            host_response_time,
            host_response_rate,
            host_acceptance_rate,
            host_is_superhost,
            host_thumbnail_url,
            host_picture_url,
            host_total_listings_count,
            host_has_profile_pic,
            listings,
          });
        }
      }
    );
  }
}
async function numberbookings(req, res){
    var date = "`date`"
    if (req.query.listing){
        connection.query(`SELECT listing_id, MONTH(STR_TO_DATE('${date}', '%Y-%m-%d')) AS month, count(*) From
        Calendar
        WHERE listing_id = '${req.query.listing}'
        GROUP BY month
        ORDER BY month
        `, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
      }
    }
module.exports = {
  hello,
  listing,
  host,
  numberbookings
};
