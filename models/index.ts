import mongoose from 'mongoose';
const { DB_CONN, NODE_ENV,DB_CONN_TEST} = process.env as {[key:string]: string};

const dbURL:string = (NODE_ENV === 'test')?DB_CONN_TEST:DB_CONN;

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

mongoose.set('useFindAndModify', false);

export default mongoose;
