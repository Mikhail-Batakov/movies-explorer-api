const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const chekToken = (token) => jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

const signToken = (user) => jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

module.exports = {
  chekToken,
  signToken,
};
