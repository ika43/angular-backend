
'use strict';

const bcrypt = require('bcrypt');

const hashPassword = async (userPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(userPassword, parseInt(process.env.SALT_ROUNDS), function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  })
}

const checkPassword = async (password, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, function (err, res) {
      if (err) reject(err)
      resolve(res)
    });
  })
}

module.exports = {
  hashPassword,
  checkPassword
}