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
  pagesize = !isNaN(req.query.pagesize) ? req.query.pagesize : 10;
  row_num = !isNaN(req.query.page) ? (+req.query.page - 1) * pagesize : 0;

  connection.query(
    `WITH Price as (Select l.id as id, round(avg(c.price),2) as price
     FROM Listing l LEFT JOIN Calendar c ON l.id = c.listing_id
     group by l.id)
     select l.id, l.num_views, l.name, l.summary, l.thumbnail_url, p.price, count(r.reviewer_id) as 'num_reviews'
     FROM Listing l LEFT JOIN Reviews r
     ON l.id  = r.listing_id
     LEFT JOIN Price p
     ON l.id = p.id
     group by l.id
     order by l.id
     ${!isNaN(req.query.page) ? `LIMIT ${row_num},${pagesize}` : ""};`,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// info of all hosts for table
async function all_hosts(req, res) {
  pagesize = !isNaN(req.query.pagesize) ? req.query.pagesize : 10;
  row_num = !isNaN(req.query.page) ? (+req.query.page - 1) * pagesize : 0;
  connection.query(
    `SELECT
       host_id,
       host_name,
       host_about,
       host_response_rate,
       host_response_time,
       host_acceptance_rate,
       host_total_listings_count,
       host_picture_url
       FROM Host
       ${!isNaN(req.query.page) ? `LIMIT ${row_num},${pagesize}` : ""};`,
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
    res.status(404).json({ message: "id not specified" });
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
            hostDetails: {
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
            },
          });
        }
      }
    );
  }
}

// get number of bookings for a listing by month
async function numberbookings(req, res) {
  var date = "`date`";
  if (req.query.id) {
    connection.query(
      `SELECT listing_id, MONTH(STR_TO_DATE(${date}, '%Y-%m-%d')) AS month, count(*) as count
       Froms
        Calendar
        WHERE listing_id = '${req.query.id}'
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
  } else {
    res.status(404).json({ message: "id not specified" });
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
    res.status(404).json({ message: "id not specified" });
  }
}

// average price for a listing by month
// price is null when the listings is not available or booked dut=ring that month
async function monthly_prices(req, res) {
  const date = "`date`";
  if (req.query.id) {
    connection.query(
      `SELECT MONTH(STR_TO_DATE(${date}, '%Y-%m-%d')) AS month, avg(price) as average_price
       From Calendar
       WHERE listing_id = ${req.query.id}
       GROUP BY month
       ORDER BY month;`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ message: results });
        }
      }
    );
  } else {
    res.status(404).json({ message: "id not specified" });
  }
}

// reviews for a particular listing with pagination
async function reviews(req, res) {
  pagesize = !isNaN(req.query.pagesize) ? req.query.pagesize : 10;
  row_num = !isNaN(req.query.page) ? (+req.query.page - 1) * pagesize : 0;
  if (req.query.id) {
    connection.query(
      `SELECT l.id, r.reviewer_id, r.reviewer_name, r.comments, r.date
     FROM Listing l, Reviews r
     WHERE r.listing_id = l.id and l.id = ${req.query.id}
     LIMIT ${row_num},${pagesize};`,
      function (error, results, fields) {
        if (error) {
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  } else {
    res.status(404).json({ message: "id not specified" });
  }
}

// frequency of bookings within certain temperature ranges
// display on the main listings page not for particular listing
async function bookings_with_temp(req, res) {
  connection.query(
    `With booking_temps AS ( SELECT w.date as date, w.avg_temp as temp
      FROM Calendar c
      INNER JOIN Weather w ON c.date = w.date )
      select floor(temp/10)*10 as range_floor, count(*) as count
      from booking_temps
           group by 1
           order by 1;
    `,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// change in price with average temp for a listing
// 5506 = id
async function price_with_temp(req, res) {
  if (req.query.id) {
    connection.query(
      `With booking_temps AS ( SELECT c.listing_id, c.price, w.date as date, w.avg_temp as temp
      FROM Calendar c
      INNER JOIN Weather w ON c.date = w.date )
      select floor(temp/10)*10 as range_floor, listing_id, round(avg(price),2) as average_price
      from booking_temps
      where listing_id = 5506
      group by range_floor, listing_id
      order by range_floor;
    `,
      function (error, results, fields) {
        if (error) {
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  } else {
    res.status(404).json({ message: "id not specified" });
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
  monthly_prices,
  reviews,
  bookings_with_temp,
  price_with_temp,
};
