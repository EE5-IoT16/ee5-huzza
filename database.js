const {Client, Pool} =  require('pg'); 

const credentials = {
  user: "moyzrfdfaeifpv",
  host: "ec2-52-208-185-143.eu-west-1.compute.amazonaws.com",
  database: "d7p2ahuv6uogme",
  password: "bb7254ca8e867367ae8a6d8c41bc1ba2e4111140087a5de8140839f06ae2e990",
  port: 5432,
};

const sql = new Pool({
  connectionString: "postgres://moyzrfdfaeifpv:bb7254ca8e867367ae8a6d8c41bc1ba2e4111140087a5de8140839f06ae2e990@ec2-52-208-185-143.eu-west-1.compute.amazonaws.com:5432/d7p2ahuv6uogme",
  ssl: {
    rejectUnauthorized: false
  }
});

async function query(queryString){
  await sql.connect();
  console.log(queryString)
  sql.query(queryString, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows)
    }
  })
}

module.exports = {
  query: query,
}