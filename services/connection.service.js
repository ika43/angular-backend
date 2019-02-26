const mongoose = require('mongoose');
const config = require('../config.json');
const { colors } = require('../handlers/console.colors');

mongoose.Promise = global.Promise;
let isConnected;

const dbConnection = () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  return mongoose.connect(process.env.DB || config.DB, { useNewUrlParser: true, useCreateIndex: true, reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000, autoReconnect: true })
    .then(db => {
      isConnected = db.connections[0].readyState;
    });
};

module.exports = {
  dbConnection
}