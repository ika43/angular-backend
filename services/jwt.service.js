const jwt = require('jsonwebtoken');

exports.decode = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
}