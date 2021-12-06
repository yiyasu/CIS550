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
// info of all listings for table
async function all_listings(req, res) {
  pagesize = req.query.pagesize ? req.query.pagesize : 10;
  row_num = !isNaN(req.query.page) ? (+req.query.page - 1) * pagesize : 0;

  connection.query(
    `Select l.id, round(avg(c.price),2) as price
    FROM Listing l LEFT JOIN Calendar c ON l.id = c.listing_id
    group by l.id
    order by l.id
    LIMIT ${row_num},${pagesize}`,
    function (error, results1, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results1) {
        connection.query(
          ` select l.id, l.num_views, l.name, l.summary, count(r.reviewer_id) as '#reviews'
          FROM Listing l LEFT JOIN Reviews r
          ON l.id  = r.listing_id
          group by l.id
          order by l.id
          LIMIT ${row_num},${pagesize};`,
          function (error, results2, fields) {
            if (error) {
              res.json({ error: error });
            } else if (results2) {
              console.log(results1);
              console.log(results2);
              final_results = results1.map((res, index) => ({
                ...res,
                ...results2[index],
              }));
              res.json({ results: final_results });
            }
          }
        );
      }
    }
  );
}

// info of all hosts for table
async function all_hosts(req, res) {
  pagesize = req.query.pagesize ? req.query.pagesize : 10;
  row_num = !isNaN(req.query.page) ? (+req.query.page - 1) * pagesize : 0;
  connection.query(
    `SELECT
       host_id,
       host_name,
       host_about,
       host_response_rate,
       host_response_time,
       host_acceptance_rate,
       host_total_listings_count
       FROM Host
       LIMIT ${row_num},${pagesize}`,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
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

// get number of bookings for a listing by month
async function numberbookings(req, res) {
  var date = "`date`";
  if (req.query.listing) {
    connection.query(
      `SELECT listing_id, MONTH(STR_TO_DATE(${date}, '%Y-%m-%d')) AS month, count(*) From
        Calendar
        WHERE listing_id = '${req.query.listing}'
        GROUP BY month
        ORDER BY month
        `,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

// increment views
async function increment_views(req, res) {
  if (req.query.id) {
    connection.query(
      `update Listing set num_views = num_views + 1
       where id = ${req.query.id};
        `,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ message: "success" });
        }
      }
    );
  } else {
    res.json({ error: "id not specified" });
  }
}
module.exports = {
  hello,
  listing,
  host,
  numberbookings,
  all_hosts,
  all_listings,
  increment_views,
};
