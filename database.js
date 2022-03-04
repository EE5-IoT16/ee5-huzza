const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://moyzrfdfaeifpv:bb7254ca8e867367ae8a6d8c41bc1ba2e4111140087a5de8140839f06ae2e990@ec2-52-208-185-143.eu-west-1.compute.amazonaws.com:5432/d7p2ahuv6uogme",
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}