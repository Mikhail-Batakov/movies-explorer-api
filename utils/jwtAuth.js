const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./config');

const chekToken = (token) => jwt.verify(token, jwtSecret);

const signToken = (user) => jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' });

module.exports = {
  chekToken,
  signToken,
};
