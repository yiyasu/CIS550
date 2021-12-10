import config from "./config.json";

const BASE_PATH = `http://${config.server_host}:${config.server_port}`;
const ALL_LISTINGS_API = `${BASE_PATH}/all_listings`;
const ALL_HOSTS_API = `${BASE_PATH}/all_hosts`;
const LISTING_API = `${BASE_PATH}/listing`;
const HOST_API = `${BASE_PATH}/host`;
const BOOKINGS_WITH_TEMP_API = `${BASE_PATH}/bookings_with_temp`;
const LISTING_NUM_BOOKINGS_API = `${LISTING_API}/num_bookings`;
const LISTING_MONTHLY_PRICES_API = `${LISTING_API}/monthly_prices`;
const LISTING_REVIEWS_API = `${LISTING_API}/reviews`;
const LISTING_PRICE_WITH_TEMP_API = `${LISTING_API}/price_with_temp`;
const LISTING_INC_VIEWS_API = `${LISTING_API}/increment_views`;

const getAllListings = async (page, pagesize) => {
  var res = await fetch(
    `${ALL_LISTINGS_API}?page=${page}&pagesize=${pagesize}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getAllHosts = async (page, pagesize) => {
  var res = await fetch(`${ALL_HOSTS_API}?page=${page}&pagesize=${pagesize}`, {
    method: "GET",
  });
  return res.json();
};

const getListing = async (id) => {
  var res = await fetch(`${LISTING_API}?id=${id}`, {
    method: "GET",
  });
  return res.json();
};

const getHost = async (id) => {
  var res = await fetch(`${HOST_API}?id=${id}`, {
    method: "GET",
  });
  return res.json();
};

const getBookingsWithTemp = async () => {
  var res = await fetch(BOOKINGS_WITH_TEMP_API, {
    method: "GET",
  });
  return res.json();
};

const getListingNumBookings = async (id) => {
  var res = await fetch(`${LISTING_NUM_BOOKINGS_API}?id=${id}`, {
    method: "GET",
  });
  return res.json();
};

const getListingMonthlyPrices = async (id) => {
  var res = await fetch(`${LISTING_MONTHLY_PRICES_API}?id=${id}`, {
    method: "GET",
  });
  return res.json();
};

const getListingReviews = async (id, page, pagesize) => {
  var res = await fetch(
    `${LISTING_REVIEWS_API}?id=${id}&page=${page}&pagesize=${pagesize}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getListingPriceWithTemp = async (id) => {
  var res = await fetch(`${LISTING_PRICE_WITH_TEMP_API}?id=${id}`, {
    method: "GET",
  });
  return res.json();
};

const incrementListingViews = async (id) => {
  var res = await fetch(`${LISTING_INC_VIEWS_API}?id=${id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

export {
  getAllListings,
  getAllHosts,
  getListing,
  getHost,
  getBookingsWithTemp,
  getListingNumBookings,
  getListingMonthlyPrices,
  getListingReviews,
  getListingPriceWithTemp,
  incrementListingViews,
};
