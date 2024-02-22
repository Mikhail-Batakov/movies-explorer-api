const {
  NODE_ENV, JWT_SECRET, SALT_ROUNDS = '10', PORT = '3000', DB_URL,
} = process.env;

const jwtSecret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

const mongoDbUrl = NODE_ENV === 'production' ? DB_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = {
  jwtSecret,
  SALT_ROUNDS,
  PORT,
  mongoDbUrl,
};
