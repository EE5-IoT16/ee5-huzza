const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://uykqvpkrwoxnnn:66bc248333e6bc87cbf78411954d89d5e156134f856cb599383234b448a29cb3@ec2-63-34-130-73.eu-west-1.compute.amazonaws.com:5432/d2b0d37k8s2rif",
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}