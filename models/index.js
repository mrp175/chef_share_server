const mongoose = require('mongoose');
const { DB_CONN, NODE_ENV,DB_CONN_TEST} = process.env;

const dbURL = (NODE_ENV === 'test')?DB_CONN_TEST:DB_CONN;

mongoose.connect(
    dbURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(`😞 can't connet to db, something went wrong! ${err}`);
    } else {
      console.log(`🦆 database connected!`);
    }
  }
);

module.exports = mongoose;
